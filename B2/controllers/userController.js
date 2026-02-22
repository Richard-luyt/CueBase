import { json } from "stream/consumers";
import User from "./../models/User.js";

const filterObj = (obj, ...allowedFields) => {
  let new_obj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      new_obj[el] = obj[el];
    }
  });
  return new_obj;
};

export const fetchUser = async (req, res) => {
  const user = req.User;
  if (!user) {
    return res.status(401).json({ status: "failed", message: "please login" });
  }
  return res.status(200).json({
    status: "success",
    data: { user },
  });
};

export const deleteMe = async (req, res) => {
  const user = await User.findById(req.User._id).select("+active");
  if(!user){
    return res.status(404).json({
      status:"failed",
      message:"user not found",
    })
  }
  user.active = false;
  await user.save();
  return res.status(204).json({
    status: "success",
    data: null,
  });
};

export const updateMe = async (req, res) => {
  // updating the current authenticated user.

  // Can not update the user's password
  if (req.body.password != undefined || req.body.passwordConfirm != undefined) {
    return res.status(400).json({
      status: "failed",
      message: "Can not update password in this route",
    });
  }

  const filteredBody = await filterObj(req.body, "Username", "email");
  const updatedUser = await User.findByIdAndUpdate(req.User._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

export const getAllUser = async (req, res) => {
  return res.status(201).json({
    status : "success",
  })
};

export const getUserProfile = async (req, res) => {
  return res.status(201).json({
    status : "success",
  })
};
