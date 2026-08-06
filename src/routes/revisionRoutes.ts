import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { reviseQuestion } from "../controllers/revisonController";

const router = express.Router();

router.patch("/revise/:id",authMiddleware,reviseQuestion);

export default router;