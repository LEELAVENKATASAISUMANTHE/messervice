import express from "express";
import bodyParser from "body-parser";
import { getmessage } from "./utils/main.js";
import { connectMongo } from "./mongo.connection.js";

const app = express();
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.json({ status: "Eligibility Service is running" });
});

const PORT = process.env.PORT || 5789;

app.listen(PORT, async () => {
  console.log(`Eligibility Service running on port ${PORT}`);

  try {
    await connectMongo();
    await getmessage();
  } catch (error) {
    console.error("Service startup failed", { error: error.message });
    process.exit(1);
  }
});
