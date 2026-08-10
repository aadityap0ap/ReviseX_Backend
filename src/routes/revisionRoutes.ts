import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { getQuestions, getTodaysRevision, reviseQuestion } from "../controllers/revisonController";

const router = express.Router();

router.patch("/revise/:id",authMiddleware,reviseQuestion);
router.get("/today",authMiddleware,getTodaysRevision);
router.get("/search",authMiddleware,getQuestions);

export default router;