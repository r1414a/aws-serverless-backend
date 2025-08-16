import ProjReq from "../models/projectrequirement.model.js";
import sendResponse from "../utils/sendResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import RestoreData from "../models/restoredata.model.js";
import User from "../models/users.model.js";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

class ProjectRequirementController {
  createProjectRequirement = asyncHandler(async (req, res) => {
    const {
      name,
      email,
      mobileNumber,
      projectDetails,
      formLocation,
      protectBusinessIdea,
    } = req.body;

    const newRequirement = new ProjReq({
      name,
      email,
      mobileNumber,
      projectDetails,
      formLocation,
      protectBusinessIdea,
      isSeen: false,
    });

    const result = await newRequirement.save();

    if (!result) {
      throw new AppError(
        500,
        "Error while saving project requirement. Please try later."
      );
    }

    const connectedUsers = await User.find({
      connectionID: { $ne: null },
    }).lean();

    if (!connectedUsers || connectedUsers.length === 0) {
      return sendResponse(
        res,
        201,
        result,
        "Your project requirement has been saved! (no dashboard sessions connected)"
      );
    }

    const client = new ApiGatewayManagementApiClient({
      endpoint: `${process.env.WS_DOMAIN}/${process.env.WS_STAGE}`,
    });

    const dataToSend = Buffer.from(
      JSON.stringify({
        type: "NEW_LEAD",
        data: result,
      })
    );

    for (const user of connectedUsers) {
      if(!user.connectionID) continue;

      const command = new PostToConnectionCommand({
        ConnectionId: user.connectionID,
        Data: dataToSend,
      });

      try{
        await client.send(command);
        console.log(`Sent WS message to ${user.connectionID}`);
      }catch(err){
        const isGone = (err?.name === "GoneException") || (err?.$metadata?.httpStatusCode === 410);

        if(isGone){
          try{
            await User.updateOne(
              {_id: user._id, connectionID: user.connectionID},
              { $set: {connectionID: null, connectedAT: null}}
            )
            console.log(`Cleared stale connection for user ${user._id}`);
          }catch(err){
 console.error("Failed to clear stale connection for user", user._id, err);
          }
        }

        console.error(`Failed to send WS message to connection ${user.connectionID}`, err);

      }
    }
    sendResponse(res, 201, result, "Your project requirement has been saved!.");
  });

  getProjectRequirement = asyncHandler(async (req, res) => {
    const { tab } = req.query;
    console.log(tab);

    const user = await User.findOne({}).lean();
    console.log(user);
    if (!tab) {
      throw new AppError(400, "Missing 'tab' query parameter.");
    }

    const data = await ProjReq.find({ formLocation: tab }).lean();
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // console.log("sortedData", sortedData);
    sendResponse(
      res,
      200,
      data,
      data.length > 0
        ? `${tab} page project requirement fetched successfully!.`
        : `No project Requirement from ${tab} page.`
    );
  });

  searchProjectRequirement = asyncHandler(async (req, res) => {
    const { tab, from, to } = req.query;

    if (!tab || !from || !to) {
      throw new AppError(400, "Missing query parameter like tab,from,to.");
    }

    const data = await ProjReq.find({
      formLocation: tab,
      createdAt: {
        $gte: new Date(from).setHours(0, 0, 0, 0),
        $lte: new Date(to).setHours(23, 59, 0, 0),
      },
    }).lean();

    sendResponse(
      res,
      200,
      data,
      data.length > 0
        ? "Record for specified date fetched successfully!."
        : "No record found!."
    );
  });

  deleteProjectRequirement = asyncHandler(async (req, res) => {
    const { deleteData } = req.body;
    console.log(typeof deleteData, deleteData);
    let deletedC;
    if (deleteData.length === 0) {
      throw new AppError(400, "missing data to delete.");
    }

    const dataIds = deleteData.map((data) => data._id);
    console.log(dataIds);

    if (deleteData.length > 1) {
      await RestoreData.insertMany(deleteData);
      deletedC = await ProjReq.deleteMany({ _id: { $in: dataIds } });
    } else {
      await RestoreData.insertOne(deleteData[0]);
      deletedC = await ProjReq.deleteOne({ _id: dataIds[0] });
    }

    console.log(deletedC);

    sendResponse(res, 200, {
      status: true,
      deleted: `${deletedC.deletedCount} records deleted.`,
    });
  });

  getLeadsWithNoSeen = asyncHandler(async (req, res) => {
    const allUnSeenLeads = await ProjReq.find({ isSeen: false }).lean();

    sendResponse(
      res,
      200,
      allUnSeenLeads,
      allUnSeenLeads.length > 0
        ? "all Unseen leads fetched!."
        : "No latest leads."
    );
  });
}

const ProjectRequirementInstance = new ProjectRequirementController();
export default ProjectRequirementInstance;
