import express from 'express';
const router = express.Router();
import PostController from "../controllers/post.controller.js"

router.route('/get-posts').get(PostController.getPosts);
router.route('/create-post').post(PostController.createPost)

export default router;