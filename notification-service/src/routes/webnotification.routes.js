import express from "express";
import {
  startKafkaProducer,
  sendMessage
} from "../controllers/kafkawebn.controller.js";

const router = express.Router();

// Initialize Kafka producer
router.post("/kafka/start", async (req, res) => {
  try {
    await startKafkaProducer();
    res.status(200).json({ message: "Kafka Producer started successfully" });
  } catch (error) {
    console.error("Error starting Kafka Producer:", error);
    res.status(500).json({ message: "Failed to start Kafka Producer" });
  }
});

// Send message via Kafka
router.post("/kafka/send", async (req, res) => {
  try {
    await sendMessage();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
