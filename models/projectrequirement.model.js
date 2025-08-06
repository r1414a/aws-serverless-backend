import mongoose from "mongoose";

const ProjectReqSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    formLocation: {
        type: String,
        enum: ["Home","Web-development","Contact-us","Portfolio","Seo","Mobile-app-development"],
        index: true
    },
    projectDetails: {
        type: String,
        required: true
    },
    protectBusinessIdea: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const ProjReq = mongoose.models.ProjectRequirement || mongoose.model('ProjectRequirement', ProjectReqSchema);

export default ProjReq;