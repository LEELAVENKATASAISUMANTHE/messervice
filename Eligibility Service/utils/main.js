import { consumer } from './kafka.js';
import { z } from 'zod';
import { fetchstudent } from './studentfectch.js';
// Zod schema for job created event
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
            fromBeginning: true
        });
        await consumer.run({
            autoCommit: false,
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString());
                console.log("Received message:", data);
                try {
                   const validatedData = jobCreatedSchema.parse(data);
                   const parsdata={
                    eligibleBatchYear: validatedData.eligibleBatchYear,
                    tenthPercent: validatedData.jobRequirements.tenthPercent,
                    twelfthPercent: validatedData.jobRequirements.twelfthPercent,
                    ugCgpa: validatedData.jobRequirements.ugCgpa,
                    minExperienceYrs: validatedData.jobRequirements.minExperienceYrs,
                    allowedBranches: validatedData.jobRequirements.allowedBranches,
                    skillsRequired: validatedData.jobRequirements.skillsRequired,
                    backlogsAllowed: validatedData.jobRequirements.backlogsAllowed,
                   }

                    console.log("Message is valid according to schema.", parsdata);
                    const students = await fetchstudent(parsdata);
                    console.log("Fetched students:", students);
                } catch (error) {
                    console.error("Schema validation error:", error.errors);
                    return; // Skip processing this message
                }
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