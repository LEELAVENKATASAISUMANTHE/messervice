import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKERS], // MUST be kafka:9092
});

export default kafka;
