import {Router, type Response, type Request, type NextFunction} from "express";
import verifyCode from "../models/verifyCode.js";
import crypto from "crypto";
import User from "../models/User.js";

const router : Router = Router();

export const verify_code = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.query;

    const user_email = Array.isArray(params.email) ? params.email[0] : params.email;
    const rawToken = Array.isArray(params.token) ? params.token[0]! : params.token!;
    if (rawToken == null || typeof rawToken !== "string") {
        return res.status(405).json({
          status: "failed",
          message: "no token sent, wrong URL",
        });
    }
    const plain_token: string = rawToken;
    const stored = await verifyCode.findOne({userEmail : user_email!});
    if(!stored) {
        return res.status(405).json({
            status : "failed",
            message: "no such verification",
        })
    }
    if(stored.expiresAt!.getTime() < Date.now()) {
        if(process.env.NODE_ENV == "development") {
            return res.status(405).json({
                status : "failed",
                message: "expires, try again later",
            })
        } else {
            return res.status(405).json({
                status : "failed",
                message: "verification failed",
            }) 
        }
        
    }
    const tokenHash = crypto
    .createHash('sha256')
    .update(plain_token)
    .digest('hex');

    const Buffer1 = Buffer.from(tokenHash, 'hex');
    const Buffer2 = Buffer.from(stored.tokenHash!, 'hex');
    if (Buffer1.length !== Buffer2.length) {
        return res.status(405).json({
            status : "failed",
            message: "verification failed",
        })
    }

    if(crypto.timingSafeEqual(Buffer1, Buffer2) === true) {
        const findUser = await User.findOne({email: user_email!});
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findOneAndUpdate(
            { email: user_email! },
            { $set: { isVerified: true } }
          );
        return res.status(200).json({
            status : "success",
            message: "verification succeeded",
        })    
    }
    else {
        return res.status(405).json({
            status : "failed",
            message: "verification failed",
        })
    }    

}

router.get("/verify", verify_code);

export default router;