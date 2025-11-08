import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  command: { type: String }, // For research submissions
  metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data
  timestamp: { type: Date, default: Date.now },
});

// Create indexes for faster queries
ActivitySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
