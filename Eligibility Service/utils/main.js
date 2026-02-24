import { consumer } from "./kafka.js";
import { z } from "zod";
import logger from "../logs/logger.js";
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
    await consumer.connect();

    await consumer.subscribe({
      topic: "job.eligibility",
      fromBeginning: false,
    });

    logger.info("Kafka consumer subscribed to job.eligibility");

    await consumer.run({
      autoCommit: false,

      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());

          logger.info("Received Kafka message", {
            jobId: data.jobId,
          });

          const validatedData = jobCreatedSchema.parse(data);

          await processEligibility(validatedData);

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);

          logger.info("Offset committed", {
            jobId: validatedData.jobId,
          });

        } catch (error) {
          logger.error("Kafka message processing failed", {
            error: error.message,
          });
        }
      },
    });
  } catch (error) {
    logger.error("Kafka consumer initialization error", {
      error: error.message,
    });
  }
};