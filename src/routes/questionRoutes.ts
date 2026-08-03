import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { addQuestion, allQuestions, getOneQuestion } from "../controllers/questionController";

const router = express.Router();

router.post("/",authMiddleware,addQuestion);
router.get("/",authMiddleware,allQuestions);
router.get("/:id",authMiddleware,getOneQuestion);
export default router;