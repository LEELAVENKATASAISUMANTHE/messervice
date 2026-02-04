import kafka from "../utils/kafka.js";

const producer = kafka.producer({
  allowAutoTopicCreation: true,
});

export const startKafkaProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (error) {
    console.error("❌ Error connecting Kafka Producer:", error);
    throw error;
  }
};

/**
 * Send notification message to Kafka
 * @param {Object} payload
 * @param {string[]} payload.tokens - FCM tokens
 * @param {string} payload.title
 * @param {string} payload.body
 * @param {Object} payload.data - optional custom data
 */
export const sendNotification = async ({
  tokens,
  title,
  body,
  data = {},
}) => {
  if (!tokens || !tokens.length) {
    throw new Error("FCM tokens are required");
  }

  const message = {
    tokens,
    title,
    body,
    data,
    timestamp: Date.now(),
  };

  try {
    await producer.send({
      topic: process.env.KAFKA_TOPIC || "notifications",
      messages: [
        {
          key: tokens[0], // helps partitioning
          value: JSON.stringify(message),
        },
      ],
    });

    console.log("✅ Notification message sent to Kafka");
  } catch (error) {
    console.error("❌ Error sending Kafka message:", error);
    throw error;
  }
};
