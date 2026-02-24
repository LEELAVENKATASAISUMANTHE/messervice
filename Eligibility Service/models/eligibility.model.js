import mongoose from "mongoose";

const eligibilitySchema = new mongoose.Schema({
  jobId: Number,
  companyName: String,
  criteria: Object,
  eligibleStudents: Array,
  processedAt: { type: Date, default: Date.now },
});

export const Eligibility = mongoose.model("Eligibility", eligibilitySchema);