const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Notification = require('../models/Notification'); // ✅ Import Notification model
const { verifyToken } = require('../middleware/auths'); // ✅ So only logged-in users can apply/update

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

/* -------------------- APPLY TO A JOB -------------------- */
router.post('/:jobId/apply', verifyToken, upload.single('resume'), async (req, res) => {
  console.log("✅ Applying job as user:", req.user.id); 
  try {
    const { name, email, phone, education, experience, relocate, reason } = req.body;
    const jobId = req.params.jobId;
    const resumePath = req.file ? `resumes/${req.file.filename}` : null;

    const newApp = await Application.create({
      jobId,
      user: req.user.id, // ✅ Store logged-in user ID
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

/* -------------------- GET ALL APPLICATIONS -------------------- */
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('jobId', 'title company')
      .populate('user', 'name email'); // ✅ See who applied
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

/* -------------------- GET APPLICATIONS BY JOB ID -------------------- */
router.get('/job/:jobId', async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate('jobId', 'title company')
      .populate('user', 'name email');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get applications by job' });
  }
});

/* -------------------- GET SINGLE APPLICATION -------------------- */
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('jobId', 'title company')
      .populate('user', 'name email');
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching application' });
  }
});

/* -------------------- UPDATE STATUS & CREATE NOTIFICATION -------------------- */
router.patch('/status/:id', verifyToken, async (req, res) => {
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
    ).populate('jobId', 'title').populate('user', 'name email');

    if (!updated) return res.status(404).json({ error: 'Not found' });

    // ✅ Create a notification for the user who applied
    await Notification.create({
      user: updated.user._id,
      message: `Your application for "${updated.jobId.title}" has been ${status}.`
    });

    res.json({ message: 'Status updated & notification sent', application: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

/* -------------------- DELETE APPLICATION -------------------- */
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
