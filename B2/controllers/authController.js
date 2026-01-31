import User from "../models/User"

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
    res.status(201).json({
        status: "success",
    });
};

export const login = async(req, res, next) => {

}

export const logout = async(req, res, next) => {

}

export const forgetPassword = async(req, res, next) => {

}