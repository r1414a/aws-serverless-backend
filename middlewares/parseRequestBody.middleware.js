import AppError from "../utils/AppError.js";


export const parseRequestBody = (req,res,next) => {
        try{
            req.body = JSON.parse(req.apiGateway.event.body);
        }catch(err){
            throw new AppError(500, "Failed to parse body.")
        }
    next();
}