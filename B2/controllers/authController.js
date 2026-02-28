import User from "../models/User.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { promisify } from "util";
import { sendEmail } from "../middlewares/email.js";
import crypto from "crypto";
import verifyCode from "../models/verifyCode.js";

//used for signup, login, logout, and reset password

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(400).json({
      status: "failed",
      message: "please login",
    });
  }
  try {
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_STRING);
    const freshuser = await User.findById(decoded.id);
    if (!freshuser) {
      return res.status(401).json({
        status: "failed",
        message: "User is deleted",
      });
    }
    if (await freshuser.changedPassword(decoded.iat) == true) {
      return res.status(401).json({
        status: "failed",
        message: "The user has changed the password",
      });
    }
    if(freshuser.isVerified === false) {
      return res.status(401).json({
        status: "failed",
        message: "the user didn't verify email",
      });
    }
    req.User = freshuser;
    next();
  } catch (err) {
    if(process.env.NODE_ENV == "development") {
      console.error("JWT verification error occured", err);
    }
    return res.status(401).json({
      status: "failed",
      message: "Authentication failed"
    });
  }
  //check if user changed password after the token was issued
};

export const restrictTo = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.User._id);
    if (!roles || roles.length === 0) {
      return next();
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        status: "failed",
        message: "permission denied",
      });
    }
    next();
  };
};

export const emailVerification = async (email) => {
  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(plainToken)
    .digest('hex');
  const newVerify = {
    userEmail : email,
    tokenHash : tokenHash,
    expiresAt : Date.now() + 15*60*1000,
  }
  const resultDelete = await verifyCode.deleteMany({ userEmail: email });
  const resultUpdate = await verifyCode.create(newVerify);
  const link = `${process.env.MAIN_WEBSITE}/auth/verify?token=${plainToken}&email=${email}`;
  const message = `click on the link to confirm your email ${link}`;
  try { 
    await sendEmail({
      email: email,
      subject: "Your email verification link",
      message: message,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

export const signup = async (req, res, next) => {
  const user = {
    Username: req.body.Username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    UserAPI: req.body.UserAPI,
  };
  const newUser = await User.create(user);
  
  try {
    const result = await emailVerification(req.body.email);
    return res.status(201).json({
      status: "success",
      message: "pre register success",
    });
  } catch (err) {
    await User.findByIdAndDelete(newUser._id);
    return res.status(500).json({
      status: "failed",
      message: err?.message ?? "Failed to send verification email",
    });
  }
};

export const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Please input email or password",
    });
  }
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return res.status(401).json({
      status: "failed",
      message: "Incorrect Email or Password",
    });
  }

  const match = await user.correctPassword(password, user.password);

  if (!match) {
    return res.status(401).json({
      status: "failed",
      message: "Incorrect Email or Password",
    });
  }
  if(user.isVerified == false) { 
    return res.status(401).json({
      status: "failed",
      message: "Not Verified",
    });
  }
  const token = JWT.sign({ id: user._id }, process.env.JWT_STRING, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  user.passwordConfirm = undefined;
  user.passwordChangeAt = undefined;

  return res.status(201).json({
    status: "success",
    token: token,
    data: {
      user,
    },
  });
};

export const logout = async (req, res, next) => {};

export const forgetPassword = async (req, res, next) => {
  //console.log("OK");
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "Can't find user",
    });
  }
  try {
    const code = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${process.env.MAIN_WEBSITE}/auth/reset-password?token=${code}`;
    const message = `Click the link below to reset your password. This link expires in 10 minutes.\n\n${resetURL}\n\nIf you didn't request this, you can ignore this email.`;
    await sendEmail({
      email: user.email,
      subject: "Your password reset token",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      token: code,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    if(process.env.NODE_ENV == "development") {
      console.error(err);
    }
    return res.status(500).json({
      status: "error",
      message: "Operation failed, please try again later."
    });
  }
};

export const resetPassword = async (req, res, next) => {
  const code = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({ passwordResetToken: code });
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "can not find the user!",
    });
  }
  if (Date.now() > user.passwordResetExpires) {
    return res.status(400).json({
      status: "error",
      message: "the token expired! please try again later",
    });
  }
  try {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = JWT.sign({ id: user._id }, process.env.JWT_STRING, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    if(process.env.NODE_ENV == "development") {
      console.error(err);
    }
    return res.status(400).json({
      status: "error",
      message: "Operation failed, please try again later."
    });
  }
};

export const updatePassword = async (req, res, next) => {
  //console.log("yes");
  const user = await User.findById(req.User._id).select("+password");
  if (!user) {
    return res.status(400).json({
      status: "failed",
      message: "Can't find the user",
    });
  }
  //console.log(req.body.password);
  //console.log(user.password);
  const isCorrect = await user.correctPassword(
    req.body.password,
    user.password,
  );
  //console.log(isCorrect);
  if (!isCorrect) {
    //console.log("yes");
    return res.status(401).json({
      status: "failed",
      message: "the orginal password is not correct!",
    });
  }
  user.password = req.body.passwordCurrent;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //console.log("yes");
  await user.save();
  return res.status(200).json({
    status: "success",
    message: "password updated",
  });
};
