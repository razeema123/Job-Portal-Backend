const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const path = require('path');


dotenv.config();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./auth/authRoutes");

const app = express(); // 👈 Initialize app before using it

const PORT = process.env.PORT || 5002;

app.use(cors()); // 👈 Now this is correct

// Middleware to parse JSON
app.use(express.json());


app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Routes
app.use('/api/jobs', jobRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/users", userRoutes);     
app.use("/auth", authRoutes);  

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

app.get('/', (req, res) => res.send('Job Application API'));

// Global error handler

app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
