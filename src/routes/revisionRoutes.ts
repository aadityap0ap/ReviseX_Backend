import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { getTodaysRevision, reviseQuestion } from "../controllers/revisonController";

const router = express.Router();

router.patch("/revise/:id",authMiddleware,reviseQuestion);
router.get("/today",authMiddleware,getTodaysRevision);

export default router;