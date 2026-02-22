import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const invitationSchema = new Schema({
    team: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team', 
        required: true 
    },
    inviter: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    inviteeEmail: { 
        type: String, 
        required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now, expires: 604800 }
});

export type Iinvite = InferSchemaType<typeof invitationSchema>;
const TeamInvite = model<Iinvite>("TeamInvite", invitationSchema);
export default TeamInvite;