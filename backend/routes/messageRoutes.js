import express from "express";
import {
    getChatHistory,
    sendMessage,
    markMessageAsRead,
    getUnreadMessageCount
} from "../controllers/messageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.get("/history/:userId", authenticate, getChatHistory);
router.post("/", authenticate, sendMessage);
router.put("/:id/read", authenticate, markMessageAsRead);
router.get("/unread-count", authenticate, getUnreadMessageCount);

export default router;
