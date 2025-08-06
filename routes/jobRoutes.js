const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const upload = require('../middlewares/upload');


router.post('/create', async (req, res) => {
  try {
    const { title, company, location, jobType, salary, description } = req.body;

    if (!title || !company || !location || !jobType || !salary || !description) {
      return res.status(400).json({
        error: 'All fields (title, company, location, jobType, salary, description) are required.'
      });
    }

    const allowedTypes = ['Full-Time', 'Part-Time', 'Internship', 'Remote'];
    if (!allowedTypes.includes(jobType)) {
      return res.status(400).json({
        error: `Invalid job type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    if (isNaN(salary) || salary < 0) {
      return res.status(400).json({ error: 'Salary must be a valid non-negative number.' });
    }

    const newJob = new Job({ title, company, location, jobType, salary, description });
    const savedJob = await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: savedJob });
  } catch (err) {
    console.error('Error creating job:', err.message);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error('Error fetching job:', err.message);
    res.status(400).json({ error: 'Invalid Job ID' });
  }
});

// ✅ Update job by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { title, company, location, jobType, salary, description } = req.body;

    if (!title || !company || !location || !jobType || !salary || !description) {
      return res.status(400).json({ error: 'All fields are required for update.' });
    }

    const allowedTypes = ['Full-Time', 'Part-Time', 'Internship', 'Remote'];
    if (!allowedTypes.includes(jobType)) {
      return res.status(400).json({ error: `Invalid job type. Allowed types: ${allowedTypes.join(', ')}` });
    }

    if (isNaN(salary) || salary < 0) {
      return res.status(400).json({ error: 'Salary must be a valid non-negative number.' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, company, location, jobType, salary, description },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found for update' });
    }

    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (err) {
    console.error('Error updating job:', err.message);
    res.status(400).json({ error: 'Invalid Job ID or data' });
  }
});

// ✅ Delete job by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found for deletion' });
    }

    res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    res.status(400).json({ error: 'Invalid Job ID' });
  }
});

module.exports = router;
// ✅ Get All Jobs with Filters and Pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      jobType,
      location,
      company,
      search
    } = req.query;

    const filters = {};

    // Apply filters
    if (jobType) filters.jobType = jobType;
    if (location) filters.location = new RegExp(location, 'i');
    if (company) filters.company = new RegExp(company, 'i');

   
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const total = await Job.countDocuments(filters);
    const jobs = await Job.find(filters)
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      jobs
    });
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});


router.post('/apply/:jobId', upload.single('resume'), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({
      message: 'Resume uploaded successfully',
      jobId: jobId,
      resumeFile: resumeFile.filename,
      resumePath: resumeFile.path
    });
  } catch (err) {
    console.error('Error uploading resume:', err.message);
    res.status(500).json({ error: 'Server error while uploading resume' });
  }
});
// ✅ Bulk delete jobs by IDs
router.post('/delete-multiple', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No job IDs provided' });
    }

    const result = await Job.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `${result.deletedCount} job(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error deleting multiple jobs:', err.message);
    res.status(500).json({ error: 'Failed to delete multiple jobs' });
  }
});


module.exports = router;