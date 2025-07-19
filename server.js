import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connectDB.js';
import errorHandler from './middlewares/error.middleware.js';
import serverless from 'serverless-http';
await connectDB();

const app = express();
let handler;
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_DEV_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE']    
}))


//all routes
import postsRoutes from './routes/post.route.js';

app.use('/api/posts', postsRoutes);

//errror handler
app.use(errorHandler);

if(process.env.NODE_ENV === 'development'){
    console.log('development');
app.listen(PORT, (req,res) => {
    console.log(`server started listening on PORT: ${PORT}`);
})
}else{
    handler = serverless(app)
}


export {handler,app}