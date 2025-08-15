import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";

import connectDB from "./src/db/connectDB.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import chatbotRoutes from "./src/chatbot/chatbotRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import Cloudinary from "./src/utils/Cloudinary.js";
import { initializeReminderSystem } from "./src/utils/reminderSystem.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

connectDB();
Cloudinary();

// Initialize interview reminder system
initializeReminderSystem();

app.get("/", (req, res) => res.send("api is working"));

app.use("/user", userRoutes);
app.use("/company", companyRoutes);
app.use("/job", jobRoutes);
app.use("/interview", interviewRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐Server is running on port ${PORT}`));
