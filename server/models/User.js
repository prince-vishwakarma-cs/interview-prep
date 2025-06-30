import mongoose, { model, Schema } from "mongoose"

const UserSchema =new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    profileImageUrl:{
        type:String,
        default:null
    }
},{
    timestamps:true
})

export const User =new mongoose.model("User",UserSchema)