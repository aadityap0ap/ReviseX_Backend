import express from "express";
import { getStatistics } from "../controllers/statisticsController";

const router = express.Router();

router.get("/",getStatistics);

export default router;