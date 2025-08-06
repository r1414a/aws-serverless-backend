import mongoose from "mongoose";

const RestoreDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    formLocation: {
        type: String,
        required: true,
    },
    projectDetails: {
        type: String,
        required: true
    },
    protectBusinessIdea: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date
    }
})

const RestoreData = mongoose.models.RestoreData || mongoose.model('RestoreData', RestoreDataSchema);

export default RestoreData;