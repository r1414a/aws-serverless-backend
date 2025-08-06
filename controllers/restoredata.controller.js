import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import RestoreData from "../models/restoredata.model.js";
import ProjReq from "../models/projectrequirement.model.js";

class RestoreDataController{
    getRestoreData = asyncHandler(async (req,res) => {
        const data  = await RestoreData.find().lean();
        // console.log(data);

        sendResponse(res, 200, data, data.length > 0 ? 'restore data fetched!.' : 'No restore data found');
    });

    setRestoreData = asyncHandler(async (req,res) => {
        const {deleteData} = req.body;
        console.log(typeof deleteData, deleteData);
        let insertedC,deletedC;
        if(deleteData.length === 0){
            throw new AppError(400, "missing data to restore.")
        }

        const dataIds = deleteData.map((data) => data._id);
        console.log(dataIds);

        if(deleteData.length > 1){
            insertedC = await ProjReq.insertMany(deleteData);
            deletedC = await RestoreData.deleteMany({_id: { $in: dataIds }});
        }else{
            insertedC = await ProjReq.insertOne(deleteData[0])
            deletedC = await RestoreData.deleteOne({_id: dataIds[0]});
        }

        sendResponse(res, 200, {status: true, deleted: `${deletedC.deletedCount} records restored.`});
    })
}

const RestoreDataInstance = new RestoreDataController();
export default RestoreDataInstance;