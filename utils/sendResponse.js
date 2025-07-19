import AppResponse from "./AppResponse.js";

const sendResponse = (res,statusCode,data,message) => {
    const response = new AppResponse(statusCode,data,message);

    res.status(statusCode).json(response);
}

export default sendResponse;