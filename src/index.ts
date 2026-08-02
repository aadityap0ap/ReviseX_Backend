import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ConnectDB } from "./db/db";
import auth from "./routes/authRoutes";
import profile from "./routes/userRoutes";


const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/authRoutes",auth);
app.use("/userRoutes",profile);

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