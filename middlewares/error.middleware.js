const errorHandler = (err,req,res,next) => {
    console.log('this is error handler')
    console.error('❌ Error:', err);
    const statusCode = err.statusCode || 500;
    const status = err.status;

    res.status(statusCode).json({
        statusCode,status,message: err.message
    })
}

export default errorHandler;