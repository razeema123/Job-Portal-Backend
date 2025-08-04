const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Remote'],
    required: true
  },
  salary: { type: Number, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
