import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ConnectDB } from "./db/db";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/userRoutes";
import questionsRoutes from "./routes/questionRoutes";
import reviseRoutes from "./routes/revisionRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import statsRoutes from "./routes/statisticsRoutes";
import calenderRoutes  from "./routes/calenderRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/auth",authRoutes);
app.use("/user",profileRoutes);
app.use("/question",questionsRoutes);
app.use("/revise",reviseRoutes);
app.use("/dashboard",dashboardRoutes);
app.use("/states",statsRoutes);
app.subscribe("/revision",calenderRoutes);

async function startServer() {
    try {
        await ConnectDB();
        console.log("Database Connected");

        app.get("/", (req, res) => {
            res.send("ReviseX Backend is Running");
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();