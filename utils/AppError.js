class AppError extends Error {
    constructor(statusCode,message = "Something went wrong"){
        super(message);
        this.statusCode = statusCode
        this.message = message
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    }
}

export default AppError;
