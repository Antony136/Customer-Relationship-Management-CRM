import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB, { getDBStatus } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

const healthHandler = (req, res) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus === "connected";

  if (req.method === "HEAD") {
    return res.status(isHealthy ? 200 : 503).end();
  }

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    service: "mini-crm-api",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};

const rootHandler = (req, res) => {
  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  return res.send("Mini CRM API is running...");
};

app.get("/", rootHandler);
app.head("/", rootHandler);
app.get("/api/health", healthHandler);
app.head("/api/health", healthHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});