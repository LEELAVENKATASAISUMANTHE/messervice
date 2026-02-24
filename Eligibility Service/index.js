import express from "express";
import bodyParser from "body-parser";
import { getmessage } from "./utils/main.js";
import { connectMongo } from "./mongo.connection.js";
import logger from "./logs/logger.js";

const app = express();
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.json({ status: "Eligibility Service is running" });
});

const PORT = process.env.PORT || 5789;

app.listen(PORT, async () => {
  logger.info("Server started");

  await connectMongo();
  await getmessage();

  logger.info(`Eligibility Service running on port ${PORT}`);
});