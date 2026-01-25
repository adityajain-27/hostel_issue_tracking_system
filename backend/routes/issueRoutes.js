import express from "express";
import { createissue } from "../controllers/issueController.js";

const router =  express.Router();

router.post("/", createissue);

export default router;

