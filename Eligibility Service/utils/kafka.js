import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "redpanda:9092")
  .split(",")
  .map(b => b.trim());

  export const TOPICS = {
  JOB_READY: "job.ready",
  JOB_ELIGIBILITY: "job.eligibility",
  JOB_ELIGIBLE_STUDENTS: "job.eligible.students",
    JOB_NOTIFICATION_SEND: "job.notification.send",
    JOB_NOTIFICATION_PENDING: "job.notification.pending"
};

const kafka = new Kafka({
  clientId: "eligibility-test-consumer",
  brokers
});

export const consumer = kafka.consumer({
  groupId: "eligibility-test-group"
});

export const producer = kafka.producer(
  {
    allowAutoTopicCreation: false
  }
);

let producerConnected = false;

export async function initKafka() {
  if (producerConnected) return;

  try {
    await producer.connect();
    producerConnected = true;
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Kafka producer connection failed", { error: err.message });
    throw err;
  }
}

export async function sendMessage(topic, message, options = {}) {
  if (!topic) throw new Error("Topic is required");
  if (!producerConnected) await initKafka();

  try {
    const metadata = await producer.send({
      topic,
      acks: -1,
      messages: [
        {
          key: options.key ? String(options.key) : undefined,
          value: JSON.stringify(message),
          headers: {
            "content-type": "application/json",
            ...(options.headers || {})
          }
        }
      ]
    });

    console.log(`Message sent to ${topic}`, { metadata });
    return metadata;
  } catch (err) {
    console.error(`Failed to send message to ${topic}`, {
      error: err.message
    });
    throw err;
  }
}

export async function publishEvent(topic, payload, options = {}) {
  return sendMessage(topic, payload, options);
}
