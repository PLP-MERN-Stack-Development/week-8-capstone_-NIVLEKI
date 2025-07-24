const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'neutral', 'anxious']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate entries for the same user on the same day
moodEntrySchema.index({ userId: 1, date: { $trunc: { $divide: ["$date", 86400000] } } }, { unique: true });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);