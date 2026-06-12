const mongoose = require('mongoose');

const UsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // store as YYYY-MM-DD string
    required: true,
  },
  analysisCount: {
    type: Number,
    default: 0,
  },
  chatCount: {
    type: Number,
    default: 0,
  },
});

// One record per user per day
UsageSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Usage', UsageSchema);