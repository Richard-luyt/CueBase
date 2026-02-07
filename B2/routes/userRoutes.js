import express from "express";
import { fetchUser, deleteUser, updateUser, getAllUser,getUserProfile } from '../controllers/userController.js';
import {signup, login, logout, forgetPassword, resetPassword} from '../controllers/authController.js'

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);


router.get('/', getAllUser);
router.patch('/update', updateUser);
router.delete('/delete', deleteUser);
router.get('/me', fetchUser);

router.get('/:username', getUserProfile);

export default router;