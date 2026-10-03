import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

connectDB();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "Driver Hub API" }));

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);