import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

if(!MONGODB_URI){
    throw new Error("Please provide MONGO_URI in environment variable."); 
}


let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}


const connectDB = async () => {

        if(cached.conn){
            console.log('Reusing existing DB connection');
            return cached.conn;
        }

        if(!cached.promise){
            cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose)
        }
        
        try{
            
            cached.conn = await cached.promise;
            console.log('Connected to mongoDB:', cached.conn.connection.host);
            return cached.conn;
    }catch(err){
        console.log('Error while connecting to DB', err);
        process.exit(1);
    }
}

export default connectDB;