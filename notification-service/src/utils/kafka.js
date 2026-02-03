import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["172.17.0.1:9092"],
});

export default kafka;