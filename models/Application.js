const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resumepath: {
    type: String,
  },
  status: {
    type: String,
    enum: ['applied', 'pending', 'interview', 'rejected', 'selected'],
    default: 'applied',
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
