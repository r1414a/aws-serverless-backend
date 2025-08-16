import ProjReq from "../models/projectrequirement.model.js";


export const performScheduledAction = async () => {
    try{
        const result = await ProjReq.updateMany(
            {isSeen: false},
            {$set: {isSeen: true}}
        )
        console.log(`Updated seen status, ${result.modifiedCount} records modified.`)
    }catch(err){
        console.log('Error in performing scheduled task.',err);
    }
}