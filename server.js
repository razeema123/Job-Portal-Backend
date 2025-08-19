const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Routes
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require("./routes/userRoutes");
const applications = require('./routes/applications');
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require('./routes/admin'); 
const resetRoutes = require("./routes/resetRoutes");

const app = express(); 
const PORT = process.env.PORT || 5002;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applications); 
app.use("/api/notifications", notificationRoutes);

app.use('/api/admin', adminRoutes);   // ✅ mount admin routes separately
app.use('/api/users', userRoutes);     
app.use("/api/auth", authRoutes); 
app.use("/api/auth", resetRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Default route
app.get('/', (_req, res) => res.send('Job Application API'));

// Error handlers
app.use((err, _req, res, _next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use((err, _req, res, _next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: err.message, stack: err.stack });
});
