import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connectDB.js';
import errorHandler from './middlewares/error.middleware.js';
import serverless from 'serverless-http';
import cookieParser from 'cookie-parser';
await connectDB();

const app = express();
let handler;
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_DEV_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE','OPTIONS'],
    credentials: true    
}))

//all routes
import projectRequirementRoutes from './routes/projectrequirement.route.js'
import authenticationRoutes from "./routes/authentication.route.js";

app.use('/api/project-requirement', projectRequirementRoutes);
app.use('/api/auth', authenticationRoutes)


//errror handler
app.use(errorHandler);

if(process.env.NODE_ENV === 'development'){
    console.log('development');
app.listen(PORT, (req,res) => {
    console.log(`server started listening on PORT: ${PORT}`);
})
}else{
    handler = serverless(app)
}


export {handler,app}