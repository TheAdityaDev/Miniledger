import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import loanRoutes from "./modules/loans/loan.routes";
import fileRoutes from "./modules/file/file.routes";
import { notFound, errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: "8mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "MiniLedger API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/file", fileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
