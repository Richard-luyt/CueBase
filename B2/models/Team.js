import mongoose, { mongo } from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName : {
        type: String,
        required : true,
        unique : true,
    },
    teamMembers : {
        type : [mongoose.Schema.Types.ObjectId],
    },
    memberNumbers : {
        type : Number,
        default : 1,
    },
    teamOwner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User', 
    }
})

const Team = mongoose.model("Team", teamSchema);
export default Team;