import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { addQuestion, allQuestions } from "../controllers/questionController";

const router = express.Router();

router.post("/",authMiddleware,addQuestion);
router.get("/",authMiddleware,allQuestions);
export default router;