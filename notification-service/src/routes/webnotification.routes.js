import express from "express";
import rateLimit from "express-rate-limit";
import {
  startKafkaProducer,
  sendNotification,
} from "../controllers/kafkawebn.controller.js";

const router = express.Router();

// Rate limiting middleware
const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many notification requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
const validateNotificationInput = (req, res, next) => {
  const { tokens, title, body } = req.body;
  
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({
      error: "INVALID_TOKENS",
      message: "FCM tokens array is required and cannot be empty",
    });
  }

  if (tokens.length > 1000) {
    return res.status(400).json({
      error: "TOO_MANY_TOKENS", 
      message: "Maximum 1000 tokens allowed per request",
    });
  }

  if (!title?.trim() || !body?.trim()) {
    return res.status(400).json({
      error: "MISSING_CONTENT",
      message: "title and body are required and cannot be empty",
    });
  }

  if (title.length > 200 || body.length > 1000) {
    return res.status(400).json({
      error: "CONTENT_TOO_LONG",
      message: "title max 200 chars, body max 1000 chars",
    });
  }

  next();
};

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
 *   body: ""
 * }
 */
router.post("/kafka/send", notificationLimiter, validateNotificationInput, async (req, res) => {
  const startTime = Date.now();
  try {
    const { tokens, title, body } = req.body;

    console.log(`📬 Processing notification request: ${tokens.length} tokens, title: "${title}"`);

    await sendNotification({
      tokens,
      title: title.trim(),
      body: body.trim(),
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Notification queued successfully in ${duration}ms`);

    res.status(200).json({
      success: true,
      message: "Notification queued successfully",
      tokenCount: tokens.length,
      processingTimeMs: duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("❌ Error sending notification:", {
      error: error.message,
      stack: error.stack,
      processingTimeMs: duration,
    });

    res.status(500).json({
      success: false,
      error: "NOTIFICATION_FAILED",
      message: "Failed to send notification",
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  }
});

export default router;