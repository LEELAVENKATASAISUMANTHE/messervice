import { pool } from '../db/db.js';
import { consumer } from './kafka.js';

export const getmessage = async () => {
    try {
        await consumer.connect();

        await consumer.subscribe({
            topic: "job.eligibility",
            fromBeginning: true
        });

        await consumer.run({
            autoCommit: false,
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString());

                console.log("📩 Received message:", data);

                // Your eligibility logic here

                await consumer.commitOffsets([
                    {
                        topic,
                        partition,
                        offset: (Number(message.offset) + 1).toString()
                    }
                ]);
            }
        });

    } catch (error) {
        console.error("Kafka consumer error:", error);
    }
};