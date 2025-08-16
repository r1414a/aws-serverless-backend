import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/connectDB.js";
import errorHandler from "./middlewares/error.middleware.js";
import serverless from "serverless-http";
import authenticationRoutes from "./routes/authentication.route.js";
import cookieParser from "cookie-parser";
import projectRequirementRoutes from "./routes/projectrequirement.route.js";
import restoreDataRoutes from "./routes/restoredata.route.js";
import mongoose from "mongoose";
import User from "./models/users.model.js";
import jwt from "jsonwebtoken";
import { performScheduledAction } from "./utils/performScheduledAction.js";


await connectDB();

const app = express();
let httpHandler, mainHandler;
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_DEV_URL,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/project-requirement", projectRequirementRoutes);
app.use("/api/auth", authenticationRoutes);
app.use("/api/restore-data", restoreDataRoutes);

//errror httpHapp.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  console.log("development");
  app.listen(PORT, (req, res) => {
    console.log(`server started listening on PORT: ${PORT}`);
  });
} else {
  httpHandler = serverless(app);
  mainHandler = async (event, context) => {
    console.log("this is event: ", event);
    console.log("this is context: ", context);

    if (!context.callbackWaitsForEmptyEventLoop) {
      context.callbackWaitsForEmptyEventLoop = false;
    }

    console.log(mongoose.connection.readyState);
    if (!mongoose.connection.readyState) {
      await connectDB();
    }

    if(event.source === "aws.events" || event["detail-type"] === "Scheduled Event"){
      console.log("📅 Lambda invoked by EventBridge Scheduler");
      await performScheduledAction();
      return { statusCode: 200, body: "Scheduled task completed" };
    }

    if (event.requestContext && event.requestContext.routeKey) {
      const routeKey = event.requestContext.routeKey;
      const connectionId = event.requestContext.connectionId;
      const connectedAt = event.requestContext.connectedAt;
      const token = event.queryStringParameters?.token;
      console.log("token", token);

      switch (routeKey) {
        case "$connect":
          console.log("$connect routekey.");
          if (!token) {
            return {
              statusCode: 401,
              body: JSON.stringify({ message: "Not Authorized!." }),
            };
          }
          try {
            const decode = jwt.verify(token, process.env.JWT_SIGN_SECRET);
            const user = await User.findById(decode.userID);
            if (!user) {
              return {
                statusCode: 401,
                body: JSON.stringify({ message: "Not Authorized!." }),
              };
            }
            user.connectionID = connectionId;
            user.connectedAT = connectedAt;
            await user.save();

            return {
              statusCode: 200,
              body: JSON.stringify({
                message: `connection made from id:${connectionId}`,
              }),
            };
          } catch (err) {
            console.log("Error during $connect", err);
            return {
              statusCode: 500,
              body: JSON.stringify({ message: "Internal server error" }),
            };
          }

        case "$disconnect":
          console.log("$disconnect routekey.");
          try {
            const updatedUser = await User.findOneAndUpdate(
              { connectionID: connectionId },
              { connectionID: null, connectedAT: null },
              { new: true }
            );

            if (!updatedUser) {
              throw new Error(
                `No user found with connectionID: ${connectionId}`
              );
            }

            return {
              statusCode: 200,
              body: JSON.stringify({
                message: `conection deleted of id:${connectionId}`,
              }),
            };
          } catch (err) {
            console.log("Error during $disconnect", err);
            return {
              statusCode: 500,
              body: JSON.stringify({ message: "Internal server error" }),
            };
          }

        default:
          console.log("default");
          return { statusCode: 200, body: "No matching route" };
      }
    }

    return httpHandler(event, context);
  };
}

export { mainHandler, app };
