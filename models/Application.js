const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resumePath: {
    type: String,
  },
  status: {
    type: String,
    enum: ['applied', 'pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'selected'],
    default: 'applied',
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
