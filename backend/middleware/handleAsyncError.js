// middleware wrapper for handling validation error from MongoDB

export default (myErrorFunction) => (req,res,next)=>{

    Promise.resolve(myErrorFunction(req,res,next)).catch(next)
}

