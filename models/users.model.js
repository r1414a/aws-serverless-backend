import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    }
},{
    timestamps: true
})

UserSchema.methods.isValidPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(err){
        throw new Error('Password comparison failed');
    }
}

const User =  mongoose.models.User || mongoose.model('User', UserSchema);

export default User;