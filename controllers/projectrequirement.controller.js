import ProjReq from "../models/projectrequirement.model.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js"; 
import RestoreData from "../models/restoredata.model.js";

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
        console.log(tab)

        if (!tab) {
            throw new AppError(400, "Missing 'tab' query parameter.")
        }

        const data = await ProjReq.find({formLocation: tab}).lean();
        data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        // console.log("sortedData", sortedData);
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
        }).lean();

        sendResponse(res, 200 ,data, data.length > 0 ? "Record for specified date fetched successfully!." : "No record found!.")

    })

    deleteProjectRequirement = asyncHandler(async (req,res) => {
        const {deleteData} = req.body;
        console.log(typeof deleteData, deleteData);
        let deletedC;
        if(deleteData.length === 0){
            throw new AppError(400, "missing data to delete.")
        }

        const dataIds = deleteData.map((data) => data._id);
        console.log(dataIds);

        if(deleteData.length > 1){
            await RestoreData.insertMany(deleteData);
            deletedC = await ProjReq.deleteMany({_id: { $in: dataIds }});
        }else{
            await RestoreData.insertOne(deleteData[0])
            deletedC = await ProjReq.deleteOne({_id: dataIds[0]});
        }

        console.log(deletedC);

        sendResponse(res, 200, {status: true, deleted: `${deletedC.deletedCount} records deleted.`});
    })
}

const ProjectRequirementInstance = new ProjectRequirementController();
export default ProjectRequirementInstance;
