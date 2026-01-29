import express from "express";
import { createItem, getAllItems, markAsClaimed } from "../controllers/lostFoundController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all open items (Authenticated users)
router.get("/", authenticate, getAllItems);

// Report a new item (Authenticated users)
router.post("/", authenticate, createItem);

// Mark item as claimed (Owner or Admin)
router.put("/:id/claim", authenticate, markAsClaimed);

export default router;
