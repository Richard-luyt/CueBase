import express from "express";
import {
  fetchUser,
  deleteMe,
  updateMe,
  getAllUser,
  getUserProfile,
} from "../controllers/userController.js";
import {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protect, updatePassword);

router.get("/", getAllUser);
router.patch("/updateMe", protect, updateMe);
router.delete("/delete", protect, deleteMe);
router.get("/me", protect, fetchUser);

router.get("/:username", getUserProfile);

export default router;
