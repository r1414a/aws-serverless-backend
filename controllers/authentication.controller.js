import User from "../models/users.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import jwt from 'jsonwebtoken'

class Authentication{
    adminLogin = asyncHandler(async (req,res) => {
        const {email, password} = req.body;
        console.log(req.body);

        const userExist = await User.findOne({email});
        console.log(userExist);

        if(!userExist){
            throw new AppError(401, 'Invalid email or password.')
        }

        const isMatch = await userExist.isValidPassword(password);
        console.log(isMatch)

        if(!isMatch){
            throw new AppError(401, 'Invalid email or password.');
        }

        const token = jwt.sign(
            {userID: userExist._id, email: userExist.email},
            process.env.JWT_SIGN_SECRET,
            {expiresIn: '4 days'}
        )

        console.log(token)

        if (!token) {
            throw new AppError(500,'Failed to generate token');
        }

        res.cookie("techinovativ.token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 4 * 24 * 60 * 60 * 1000
        })

        sendResponse(res,200, {status: true}, "Login successfull!.")

    })

    checkAuth = asyncHandler(async (req,res) => {
        const token = req.cookies['techinovativ.token'];
        console.log(req.cookies)

        if(!token){
            throw new AppError(401, "Not Authorized")
        }

        const decode = jwt.verify(token, process.env.JWT_SIGN_SECRET);
        console.log(decode);

        const user  = await User.findById(decode.userID);
        console.log(user)
        
        if(!user){
            throw new AppError(401, "Not Authorized")
        }

        sendResponse(res, 200, {status: true}, "authentication successfull!.")
    })
}

const AuthenticationInstance = new Authentication();
export default AuthenticationInstance;