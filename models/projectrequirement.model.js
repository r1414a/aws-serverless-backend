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
        unique: true,
        required: true
    },
    mobileNumber: {
        type: String,
        unique:true,
        required: true
    },
    formLocation: {
        type: String,
        enum: ["Home","WebDev","Contact","Portfolio","Seo"],
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