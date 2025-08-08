const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

// ✅ Configure multer for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes'); // create folder if not exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// ✅ Apply to a job with file upload
router.post('/:jobId/apply', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, education, experience, relocate, reason } = req.body;
    const jobId = req.params.jobId;
    const resumePath = req.file ? `resumes/${req.file.filename}` : null;
    

    const newApp = await Application.create({
      jobId,
      name,
      email,
      phone,
      education,
      experience,
      relocate,
      reason,
       resumePath
    });

    res.status(201).json(newApp);
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});


// 📌 Get All Applications
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// 📌 Get applications by job ID
router.get('/job/:jobId', async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get applications by job' });
  }
});

// 📌 Get single application by ID
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching application' });
  }
});

// 📌 Update application status (PATCH)
router.patch('/status/:id', async (req, res) => {
  const { status } = req.body;
  const allowed = ['applied', 'reviewed', 'interview', 'rejected', 'selected', 'shortlisted'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Status updated', application: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// 📌 Delete application
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
