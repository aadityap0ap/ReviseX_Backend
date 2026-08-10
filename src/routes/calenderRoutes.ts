import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { getRevisionCalender } from "../controllers/calenderController";

const router = express.Router();

router.get("/calender",authMiddleware,getRevisionCalender);

export default router;