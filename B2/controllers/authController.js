import User from "../models/User.js"
import JWT from "jsonwebtoken"
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import {promisify} from "util";

//used for signup, login, logout, and reset password

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    } 
    if (!token) {
        return res.status(400).json({
            status: "failed",
            message: "please login",
        })
    }

    try {
        const decoded = await promisify(JWT.verify)(token, process.env.JWT_STRING);
        const freshuser = await User.findById(decoded.id);
        if (!freshuser) {
            return res.status(401).json({
                status: "failed",
                error: "User is deleted",
            })
        }
        if(freshuser.changedPassword(decoded.iat) == true) {
            return res.status(401).json({
                status: "failed",
                error: "The user has changed the password",
            })
        }
        req.User = freshuser;
    } catch (err) {
        return res.status(401).json({
            status: "failed",
            error: err,
        })
    }
    //check if user changed password after the token was issued

    next();
}

export const signup = async(req, res, next) => {
    const user = {
        Username : req.body.Username,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        UserAPI : req.body.UserAPI,
        passwordChangeAt: req.body.passwordChangeAt,
    }
    const signup = await User.create(user);
    const token = JWT.sign({id : signup._id}, process.env.JWT_STRING, {
        expiresIn: process.env.JWT_EXPIRES
    });
    return res.status(201).json({
        status: "success",
        token : token,
        data : {
            user: signup
        }
    });
};

export const login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({
            status: "failed",
            message: "Please input email of password"
        });
        next();
    }
    const user = await User.findOne({email : email}).select('+password');
    const match = user.correctPassword(password, user.password);

    if (!user || !match) {
        return res.status(401).json({
            status: "failed",
            message: "Incorrect Email or Password",
        });
    }
    const token = JWT.sign({id : user._id}, process.env.JWT_STRING, {
        expiresIn: process.env.JWT_EXPIRES
    });
    return res.status(201).json({
        status: "success",
        token : token,
        data : {
            user: signup
        }
    });
}

export const logout = async(req, res, next) => {

}

export const forgetPassword = async(req, res, next) => {

}