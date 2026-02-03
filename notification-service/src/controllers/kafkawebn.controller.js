import kafka from "../utils/kafka.js";

const producer = kafka.producer();

export const startKafkaProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (error) {
    console.error("Error connecting Kafka Producer:", error);
  }
};

export const sendMessage = async () => {
  await producer.send({
    topic: "test-topic",
    messages: [
      {
        key: "user-1",
        value: JSON.stringify({
          userId: 1,
          message: "Hello Kafka",
        }),
      },
    ],
  });

  console.log("Message sent");
};