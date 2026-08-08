import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { getDashboard } from "../controllers/dashboardController";

const router = express.Router();

router.get("/",authMiddleware,getDashboard);

export default router;