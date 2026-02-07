import handleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // CastError 

    if(err.name === 'CastError'){
        const message = `This is invalid resource ${err.path}`;
        err = new handleError(message , 404)
    }

    // Duplicate key Error 
    if(err.code === 11000 ){
        const message = `This ${Object.keys(err.keyValue)} already registered, Please Login to continue.`
        err = new handleError(message , 400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}