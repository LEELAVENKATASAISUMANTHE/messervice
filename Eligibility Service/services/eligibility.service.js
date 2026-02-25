import { fetchstudent } from "../utils/studentfectch.js";
import { Eligibility } from "../models/eligibility.model.js";
import { EventLog } from "../models/eventlog.model.js";
import logger from "../logger.js";

export const processEligibility = async (validatedData) => {
  try {
    const criteria = {
      eligibleBatchYear: validatedData.eligibleBatchYear,
      tenthPercent: validatedData.jobRequirements.tenthPercent,
      twelfthPercent: validatedData.jobRequirements.twelfthPercent,
      ugCgpa: validatedData.jobRequirements.ugCgpa,
      allowedBranches: validatedData.jobRequirements.allowedBranches,
    };

    logger.info("Fetching eligible students", { criteria });

    const students = await fetchstudent(criteria);

    const eligibilityRecord = await Eligibility.create({
      jobId: validatedData.jobId,
      companyName: validatedData.companyName,
      criteria,
      eligibleStudents: students,
    });

    await EventLog.create({
      eventType: "JOB_CREATED",
      jobId: validatedData.jobId,
      status: "SUCCESS",
      message: `Processed ${students.length} students`,
      rawPayload: validatedData,
    });

    logger.info("Eligibility processed successfully", {
      jobId: validatedData.jobId,
      eligibleCount: students.length,
    });

    return {
      jobId: validatedData.jobId,
      companyName: validatedData.companyName,
      criteria,
      eligibleStudents: students,
      eligibleCount: students.length,
      processedAt: eligibilityRecord.processedAt,
    };

  } catch (error) {
    logger.error("Eligibility processing failed", {
      jobId: validatedData?.jobId,
      error: error.message,
    });

    try {
      await EventLog.create({
        eventType: "JOB_CREATED",
        jobId: validatedData?.jobId,
        status: "FAILED",
        message: error.message,
        rawPayload: validatedData,
      });
    } catch (eventLogError) {
      logger.error("Failed to save failure event log", {
        jobId: validatedData?.jobId,
        error: eventLogError.message,
      });
    }

    throw error;
  }
};
