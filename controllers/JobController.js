// controllers/JobController.js
const Job = require('./models/Job');

// Create job
exports.createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      recruiter: req.user._id   // recruiter = logged-in recruiter
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get only logged-in recruiter's jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
