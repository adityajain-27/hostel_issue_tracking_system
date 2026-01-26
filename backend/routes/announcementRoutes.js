import express from "express";
import { createAnnouncement } from "../controllers/announcementController.js";
import { getAllAnnouncements } from "../controllers/announcementController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// making route to create announcement only for admin
router.post("/", authenticate, isAdmin, createAnnouncement);
router.get("/", getAllAnnouncements);

export default router;