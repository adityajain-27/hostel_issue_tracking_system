import express from "express";
import { createStudent } from "../controllers/adminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js"; 

const router = express.Router();

// Only admin can create students
router.post("/create-student", authenticate, isAdmin, createStudent); 

export default router;