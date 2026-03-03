import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxLength:[25, "Invalid name.Please Enter a name with fewer than 25 characters."],
        minLength:[3, "Name should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minLength:[8, "Password should be greater than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:String
},{timestamps:true})

// Password Hashing 

userSchema.pre("save" , async function(){
    if(!this.isModified("password")){
    return; // only hash if password is modified
    }
    this.password = await bcryptjs.hash(this.password, 10);
})

userSchema.methods.getJWTToken=function(){
 return jwt.sign({id:this._id} , process.env.JWT_SECRET_KEY , {
      expiresIn:process.env.JWT_EXPIRE,
})
}

userSchema.methods.verifyPassword = async function(userEnteredPassword){
    return await bcryptjs.compare(userEnteredPassword , this.password);
}

// generating Token 

userSchema.methods.generatePasswordResetToken = function(){
const resetToken = crypto.randomBytes(20).toString('hex');
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
// 30*60*1000 =  30 minutes
this.resetPasswordExpire = Date.now()+30*60*1000 ;
return resetToken

}
 
export default mongoose.model("User",userSchema)