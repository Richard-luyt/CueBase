import express from "express";
import { protect } from "../controllers/authController.js";
import { createTeam, sendInvite, recieveInvites, makeDecision, deleteTeam } from "../controllers/teamController.js";

const router = express.Router();

router.post("/createTeam",protect, createTeam);
router.post("/deleteTeam",protect, deleteTeam);
router.post("/sendInvite",protect, sendInvite);
router.get("/recieveInvites", protect, recieveInvites);
router.post("/invite/:inviteId/respond", protect, makeDecision);

export default router;