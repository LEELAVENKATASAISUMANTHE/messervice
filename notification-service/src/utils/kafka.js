import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["kafka:9092"],
});

export default kafka;