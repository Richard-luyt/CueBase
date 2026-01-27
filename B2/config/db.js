import mongoose from "mongoose"

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    }catch(error){
        console.error(`There is a error ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;