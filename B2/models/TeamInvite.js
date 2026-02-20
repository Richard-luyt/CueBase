import mongoose, { mongo } from "mongoose";

const invitationSchema = new mongoose.Schema({
    team: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team', 
        required: true 
    },
    inviter: { 
        type: mongoose.Schema.Types.ObjectId, 
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

const TeamInvite = mongoose.model("TeamInvite", invitationSchema);
export default TeamInvite;