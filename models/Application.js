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
  resumeLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'interview', 'rejected', 'selected'],
    default: 'applied',
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
