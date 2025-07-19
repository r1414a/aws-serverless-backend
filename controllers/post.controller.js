import Posts from "../models/post.model.js";
import sendResponse from "../utils/sendResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js"; 

class PostController {
    
    getPosts = asyncHandler(async (req,res) => {
        const posts = await Posts.find().lean();
        if(!posts){
            throw new AppError(500, "Error while fetching posts");
        }
        sendResponse(res, 200, posts, "fetched all posts successfully!.");
    })

    createPost = asyncHandler(async (req,res) => {
        const { title, body, tags } = JSON.parse(req.body);
        console.log('API GATEWAY',req.apiGateway.event.body, typeof req.apiGateway.event.body);
         console.log("post",req,title, body, tags);

        if(!title || !body || !tags){
            throw new AppError(400, "All fields are required.")
        }
        const post = new Posts({
            title,
            body,
            tags,
        });
        const result = await post.save();
        if(!result){
            throw new AppError(500, "Error while creating new post.");
        }
        sendResponse(res, 200, null, "Post created successfully!.");
    })

}

const PostControllerInstance = new PostController();
export default PostControllerInstance;
