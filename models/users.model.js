import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    }
},{
    timestamps: true
})


const User =  mongoose.models.User || mongoose.model('user', UserSchema);

export default User;