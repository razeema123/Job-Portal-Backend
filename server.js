const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express(); // 👈 Initialize app before using it

const PORT = process.env.PORT || 5002;

app.use(cors()); // 👈 Now this is correct

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
