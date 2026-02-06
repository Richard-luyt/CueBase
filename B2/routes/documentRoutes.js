import express from "express";
import {createDocument, deleteDocument, getDocument} from "../controllers/documentController.js";
import {protect} from "../controllers/authController.js";

const router = express.Router();

router.post('/uploadDoc', protect, createDocument);
router.post('/deleteDoc', protect, deleteDocument);
router.get('/getDoc', protect, getDocument);

export default router;