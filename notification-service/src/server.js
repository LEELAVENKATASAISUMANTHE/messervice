import express from "express";
import tokenRoutes from "./routes/token.routes.js";

const app = express();

app.use(express.json());

// 🔑 THIS LINE IS REQUIRED
app.use("/notify", tokenRoutes);

// optional health/root routes
app.get("/", (req, res) => {
  res.send("Notification Service is up and running!");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
