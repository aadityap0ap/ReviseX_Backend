import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { addQuestion, allQuestions, deleteQuestion, getOneQuestion, updateQuestion } from "../controllers/questionController";

const router = express.Router();

router.post("/",authMiddleware,addQuestion);
router.get("/",authMiddleware,allQuestions);
router.get("/:id",authMiddleware,getOneQuestion);
router.put("/:id",authMiddleware,updateQuestion);
router.delete("/:id",authMiddleware,deleteQuestion);
export default router;