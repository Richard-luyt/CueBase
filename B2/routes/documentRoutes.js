import express from "express";
import {
  deleteDocument,
  getDocument,
} from "../controllers/documentController.js";
import { protect } from "../controllers/authController.js";
import path from "path";
import {
  documentParsing,
  queryDocument,
} from "../middlewares/documentUploadAndQuery.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/uploadDoc",
  protect,
  upload.single("singleFile"),
  documentParsing,
);
router.post("/queryDoc", protect, queryDocument);
router.post("/deleteDoc", protect, deleteDocument);
router.get("/getDoc", protect, getDocument);

//router.post('/FileParsing', protect, upload.single("singleFile"), documentParsing);

export default router;
