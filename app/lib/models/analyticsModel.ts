import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  page: { type: String, required: true },
  userAgent: String,
  ipAddress: String,
  count: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);