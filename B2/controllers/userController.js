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

export const fetchUser = async (req, res) => {};

export const deleteMe = async (req, res) => {
  const user = await User.findById(req.body._id).select("+active");
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

export const getAllUser = async (req, res) => {};

export const getUserProfile = async (req, res) => {};
