import express from "express";
import { sendMessage, getHistory } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ use correct name

const router = express.Router();

// Protect both routes
router.post("/", protect, sendMessage);
router.get("/history", protect, getHistory);

export default router;
