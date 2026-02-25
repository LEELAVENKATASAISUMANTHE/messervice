import { consumer, initKafka, publishEvent, TOPICS } from "./kafka.js";
import { z } from "zod";
import logger from "../logger.js";
import { processEligibility } from "../services/eligibility.service.js";

const jobCreatedSchema = z.object({
  event: z.literal("JOB_CREATED"),
  jobId: z.number(),
  companyName: z.string(),
  minCgpa: z.number(),
  allowedBranches: z.array(z.string()),
  eligibleBatchYear: z.number(),
  jobRequirements: z.object({
    jobRequirementId: z.number(),
    tenthPercent: z.number(),
    twelfthPercent: z.number(),
    ugCgpa: z.number(),
    minExperienceYrs: z.number(),
    allowedBranches: z.array(z.string()),
    skillsRequired: z.string(),
    additionalNotes: z.string(),
    backlogsAllowed: z.number().nullable(),
  }),
  timestamp: z.string().datetime(),
});

export const getmessage = async () => {
  try {
    await initKafka();
    await consumer.connect();

    await consumer.subscribe({
      topic: TOPICS.JOB_ELIGIBILITY,
      fromBeginning: false,
    });

    logger.info("Kafka consumer subscribed to job.eligibility");

    await consumer.run({
      autoCommit: false,

      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (!message.value) {
            throw new Error("Kafka message value is empty");
          }

          const data = JSON.parse(message.value.toString());

          logger.info("Received Kafka message", {
            jobId: data.jobId,
            topic,
            partition,
            offset: message.offset,
          });

          const validatedData = jobCreatedSchema.parse(data);

          const eligibilityResult = await processEligibility(validatedData);

          logger.info("Publishing event to Redpanda for notification pending", {
            jobId: validatedData.jobId,
            topic: TOPICS.JOB_NOTIFICATION_PENDING,
          });
          console.log("Eligibility result:", eligibilityResult);
          console.log("--------------------------------------------------------------------");
          console.log("Publishing event to Redpanda for notification pending", {
            jobId: validatedData.jobId,
            topic: TOPICS.JOB_NOTIFICATION_PENDING,
          });
          console.log("--------------------------------------------------------------------");
          console.log("\n \n \n \n \n \n \n \n \n \n \n \n \n");

          await publishEvent(TOPICS.JOB_NOTIFICATION_PENDING, eligibilityResult, {
            key: validatedData.jobId,
            headers: {
              "content-type": "application/json"
            }
          });
            console.log("--------------------------------------------------------------------");
          console.log("\n \n \n \n \n \n \n \n \n \n \n \n \n");

          logger.info("Event published to Redpanda for notification pending", {
            jobId: validatedData.jobId,
            topic: TOPICS.JOB_NOTIFICATION_PENDING,
          });

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);

          logger.info("Offset committed", {
            jobId: validatedData.jobId,
            topic,
            partition,
            offset: message.offset,
          });

        } catch (error) {
          const isNonRetryable =
            error instanceof SyntaxError || error instanceof z.ZodError;

          logger.error("Kafka message processing failed", {
            error: error.message,
            topic,
            partition,
            offset: message.offset,
            nonRetryable: isNonRetryable,
          });

          if (isNonRetryable) {
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);

            logger.warn("Invalid message skipped and offset committed", {
              topic,
              partition,
              offset: message.offset,
            });
          }
        }
      },
    });
  } catch (error) {
    logger.error("Kafka consumer initialization error", {
      error: error.message,
    });
    throw error;
  }
};
