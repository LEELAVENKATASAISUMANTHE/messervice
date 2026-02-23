import pool from '../db/db.js';
import { consumer } from './kafka.js';

export const getmessage = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: "job.eligibility",
            fromBeginning: true
        });
        await consumer.run(
            {
                autocommit: false,
                eachMessage: async ({ topic, partition, message }) => {
                    const data =JSON.parse(message.value.toString());
                    console.log(data);
                   
                }
            } );
    } catch (error) {
        console.error("Error processing Kafka message:", error);
    }finally {
        await consumer.disconnect();
    }

}