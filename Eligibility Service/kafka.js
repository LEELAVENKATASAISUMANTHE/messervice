const { Kafka } = require("kafkajs");

const brokers = (process.env.KAFKA_BROKERS || "redpanda:9092")
  .split(",")
  .map(b => b.trim());

const kafka = new Kafka({
  clientId: "eligibility-test-consumer",
  brokers
});

const consumer = kafka.consumer({
  groupId: "eligibility-test-group"
});

async function start() {
  try {
    console.log("🔌 Connecting to Kafka...");
    await consumer.connect();

    console.log("📡 Subscribing to job.eligibility...");
    await consumer.subscribe({
      topic: "job.eligibility",
      fromBeginning: true
    });

    console.log("🚀 Consumer started. Waiting for messages...\n");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();

        console.log("📥 Received Message:");
        console.log("Topic:", topic);
        console.log("Partition:", partition);
        console.log("Offset:", message.offset);
        console.log("Key:", message.key ? message.key.toString() : undefined);
        console.log("Value:", value);
        console.log("--------------------------------------------------\n");
      }
      }
    );
  } catch (err) {
    console.error("Kafka consumer error:", err);
  }
}

module.exports = { start };