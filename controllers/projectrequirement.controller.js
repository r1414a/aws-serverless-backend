import ProjReq from "../models/projectrequirement.model.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js"; 

class ProjectRequirementController {
    
    createProjectRequirement = asyncHandler(async (req,res) => {
        const { name, email, mobileNumber, projectDetails, formLocation } = req.body;

        const newRequirement = new ProjReq({
            name,email,mobileNumber,projectDetails,formLocation
        })
        
        const result = await newRequirement.save();

        if(!result){
            throw new AppError(500, "Error while saving project requirement. Please try later.")
        }

        sendResponse(res, 201, result, "Your project requirement has been saved!.")
        
    })

    getProjectRequirement = asyncHandler(async (req,res) => {
        const {tab} = req.query;

        if (!tab) {
            throw new AppError(400, "Missing 'tab' query parameter.")
        }

        const data = await ProjReq.find({formLocation: tab}).lean();
        
        sendResponse(res,200,data, data.length > 0 ? `${tab} page project requirement fetched successfully!.`: `No project Requirement from ${tab} page.`)
     
    })

    searchProjectRequirement = asyncHandler(async (req,res) => {
        const {tab,from,to} = req.query;

        if (!tab || !from || !to) {
            throw new AppError(400, "Missing query parameter like tab,from,to.")
        }

        const data = await ProjReq.find({
            formLocation: tab,
            createdAt: {
                $gte: new Date(from).setHours(0,0,0,0),
                $lte: new Date(to).setHours(23,59,0,0)
            }
        });

        sendResponse(res, 200 ,data, data.length > 0 ? "Record for specified date fetched successfully!." : "No record found!.")

    })

}

const ProjectRequirementInstance = new ProjectRequirementController();
export default ProjectRequirementInstance;
