const mongoose = require('mongoose');

const TimerSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  sessionType: {
    type: String,
    enum: ['Work', 'Break', 'Manual'],
    default: 'Work'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimerSession', TimerSessionSchema);
