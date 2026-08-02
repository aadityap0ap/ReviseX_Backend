import express from "express";
import {getProfile} from "../controllers/profileControllers"
import { authMiddleware } from "../middlewares/middleware";

const router = express.Router();

router.get("/me",authMiddleware,getProfile);

export default router;