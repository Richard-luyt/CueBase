import User from "../models/User.js"
import JWT from "jsonwebtoken"
import bcrypt from "bcryptjs";
import dotenv from "dotenv"

//used for signup, login, logout, and reset password


export const signup = async(req, res, next) => {
    const user = {
        Username : req.body.Username,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        UserAPI : req.body.UserAPI,
    }
    const signup = await User.create(user);
    const token = JWT.sign({id : signup._id}, process.env.JWT_STRING, {
        expiresIn: process.env.JWT_EXPIRES
    });
    res.status(201).json({
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
        res.status(400).json({
            status: "failed",
            message: "Please input email of password"
        });
        next();
    }
    const user = await User.findOne({email : email}).select('+password');
    const match = user.correctPassword(password, user.password);

    if (!user || !match) {
        res.status(401).json({
            status: "failed",
            message: "Incorrect Email or Password",
        });
        next();
    }
    const token = JWT.sign({id : user._id}, process.env.JWT_STRING, {
        expiresIn: process.env.JWT_EXPIRES
    });
    res.status(201).json({
        status: "success",
        token : token,
        data : {
            user: signup
        }
    });
    next();
}

export const logout = async(req, res, next) => {

}

export const forgetPassword = async(req, res, next) => {

}