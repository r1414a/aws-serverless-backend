import { validationResult } from 'express-validator';
import AppError from '../../utils/AppError.js';


const validateRequest = (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const message = errors.array().map(err => err.msg).join(', ');
        throw new AppError(400, message)
    }

    next();
}

export default validateRequest;