import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    tags: [String]
},
{timestamps: true})

const Posts = mongoose.model('Post', PostSchema);

export default Posts;