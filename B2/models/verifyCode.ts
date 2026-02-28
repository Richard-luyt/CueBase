import { Mongoose, Schema, type InferSchemaType, model } from "mongoose";

const VerifySchema = new Schema ({
    userEmail : {
        type: String,
        unique: true,
    },
    tokenHash : {
        type: String,
    },
    expiresAt : {
        type: Date, 
        expires: 0,
    }

});

type Verify = InferSchemaType<typeof VerifySchema>;
const verifyCode = model<Verify>("VerifyCode", VerifySchema);
export default verifyCode;