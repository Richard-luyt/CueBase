import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const teamSchema = new Schema({
    teamName : {
        type: String,
        required : true,
        unique : true,
    },
    teamMembers : {
        type : [Schema.Types.ObjectId],
<<<<<<< HEAD
        index: true,
=======
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06
    },
    memberNumbers : {
        type : Number,
        default : 1,
    },
    teamOwner : {
        type : Schema.Types.ObjectId,
        required : true,
        ref: 'User', 
    }
})

export type Iteam = InferSchemaType<typeof teamSchema>;

const Team = model<Iteam>("Team", teamSchema);

export default Team;