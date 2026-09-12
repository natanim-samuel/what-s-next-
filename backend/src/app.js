import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import householdRoutes from "./routes/householdRoutes.js";
import choreRoutes from "./routes/choreRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/households", householdRoutes);
app.use("/api", choreRoutes);
app.use("/api", assignmentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;