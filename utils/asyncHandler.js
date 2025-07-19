// function asyncHandler(fn){
//     return (req,res,next) => {
//         Promise.resolve(fn(req,res,next)).catch(next)
//     }
// }

function asyncHandler(fn){
    return async (req,res,next) => {
        try{
            await fn(req,res,next);
        }catch(err){
            next(err);
        }
    }
}


export default asyncHandler;