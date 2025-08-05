const Application = require('../models/Application');

// POST - Apply for a job
exports.applyJob = async (req, res) => {
  try {
    const { name, email, resumeLink } = req.body;
    const { jobId } = req.params;

    const application = await Application.create({ jobId, name, email, resumeLink });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - All Applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - Applications for a job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const apps = await Application.find({ jobId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - One Application
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT - Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE - Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
