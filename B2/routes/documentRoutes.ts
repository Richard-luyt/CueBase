import { Router, type Request } from "express";
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
import multer, { type StorageEngine } from "multer";

const router : Router = Router();

const storage : StorageEngine = multer.diskStorage({
  destination: (req : Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/");
  },
  filename: (req : Request, file: Express.Multer.File, cb) => {
    const ext : string = path.extname(file.originalname);
    const uniqueName : string =  `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
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
