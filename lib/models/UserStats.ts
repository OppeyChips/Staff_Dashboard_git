import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
});

const UserStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalTimeSpent: { type: Number, default: 0 }, // in minutes
  researchSubmissions: { type: Number, default: 0 },
  activeDays: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  sessions: [SessionSchema],
  commandStats: {
    AFK: { type: Number, default: 0 },
    Tempvoice: { type: Number, default: 0 },
    Highlight: { type: Number, default: 0 },
  },
  updatedAt: { type: Date, default: Date.now },
});

// Create index for faster lookups
UserStatsSchema.index({ userId: 1 });

export default mongoose.models.UserStats || mongoose.model('UserStats', UserStatsSchema);
