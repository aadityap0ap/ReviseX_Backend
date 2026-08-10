import express from "express";
import { getStatistics } from "../controllers/statisticsController";
import { authMiddleware } from "../middlewares/middleware";

const router = express.Router();

router.get("/",authMiddleware,getStatistics);

export default router;