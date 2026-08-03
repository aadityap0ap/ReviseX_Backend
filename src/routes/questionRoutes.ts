import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { addQuestion } from "../controllers/questionController";

const router = express.Router();

router.post("/",authMiddleware,addQuestion);
export default router;