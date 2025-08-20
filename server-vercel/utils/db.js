import mongoose from "mongoose"

export const connectDB = async(mongouri)=>{
    mongoose.connect(mongouri).then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    }).catch((err)=>{
        console.log(err);
    })  
}