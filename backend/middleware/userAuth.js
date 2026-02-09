import User from "../models/userModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js"
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token)
    if (!token) {
        return next(new handleError("Authentication is missing! Please login to access resources", 401))
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //   console.log(decodedData);
    req.user = await User.findById(decodedData.id)
    next()
})