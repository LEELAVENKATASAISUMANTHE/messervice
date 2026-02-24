import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema({
  eventType: String,
  jobId: Number,
  status: String,
  message: String,
  rawPayload: Object,
  createdAt: { type: Date, default: Date.now },
});

export const EventLog = mongoose.model("EventLog", eventLogSchema);