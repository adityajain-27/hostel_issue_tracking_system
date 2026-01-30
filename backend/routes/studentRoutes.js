import express from "express";
import { getAllStudents, getStudentDetails, deactivateStudent } from "../controllers/studentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.get("/", authenticate, isAdmin, getAllStudents);
router.get("/:id", authenticate, isAdmin, getStudentDetails);
router.put("/:id/deactivate", authenticate, isAdmin, deactivateStudent);

export default router;
