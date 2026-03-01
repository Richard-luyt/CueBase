import mongoose from "mongoose"
import dns from "dns"

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('development mode');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
            autoIndex: true,
        });
        console.log("MongoDB Connected");
    }catch(error){
        console.error(`There is a error ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;