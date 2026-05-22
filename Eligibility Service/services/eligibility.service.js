import { fetchApplicationDeadline, fetchstudent } from "../utils/studentfectch.js";
import { Eligibility } from "../models/eligibility.model.js";
import { EventLog } from "../models/eventlog.model.js";

export const processEligibility = async (validatedData) => {
  try {
    const criteria = {
      eligibleBatchYear: validatedData.eligibleBatchYear,
      tenthPercent: validatedData.jobRequirements.tenthPercent,
      twelfthPercent: validatedData.jobRequirements.twelfthPercent,
      ugCgpa: validatedData.jobRequirements.ugCgpa,
      allowedBranches: validatedData.jobRequirements.allowedBranches,
    };

    console.log("Fetching eligible students", { criteria });

    const students = await fetchstudent(criteria);
    const applicationDeadline = await fetchApplicationDeadline(validatedData.jobId);

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

    console.log("Eligibility processed successfully", {
      jobId: validatedData.jobId,
      eligibleCount: students.length,
      applicationDeadline,
    });

    return {
      jobId: validatedData.jobId,
      companyName: validatedData.companyName,
      criteria,
      eligibleStudents: students,
      eligibleCount: students.length,
      applicationDeadline,
      processedAt: eligibilityRecord.processedAt,
    };

  } catch (error) {
    console.error("Eligibility processing failed", {
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
      console.error("Failed to save failure event log", {
        jobId: validatedData?.jobId,
        error: eventLogError.message,
      });
    }

    throw error;
  }
};
