import express from "express";
import {
  startKafkaProducer,
  sendNotification,
} from "../controllers/kafkawebn.controller.js";

const router = express.Router();

/**
 * Initialize Kafka producer
 * Call this once on startup OR keep this endpoint for manual init
 */
router.post("/kafka/start", async (req, res) => {
  try {
    await startKafkaProducer();
    res.status(200).json({
      message: "Kafka Producer started successfully",
    });
  } catch (error) {
    console.error("Error starting Kafka Producer:", error);
    res.status(500).json({
      message: "Failed to start Kafka Producer",
    });
  }
});

/**
 * Send notification via Kafka
 * Expects:
 * {
 *   tokens: [],
 *   title: "",
 *   body: "",
 *   data: {}
 * }
 */
router.post("/kafka/send", async (req, res) => {
  try {
    const { tokens, title, body, data } = req.body;

    // 🔐 Basic validation
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({
        message: "FCM tokens array is required",
      });
    }

    if (!title || !body) {
      return res.status(400).json({
        message: "title and body are required",
      });
    }

    await sendNotification({
      tokens,
      title,
      body,
      data,
    });

    res.status(200).json({
      message: "Notification queued successfully",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      message: "Failed to send notification",
    });
  }
});

export default router;
