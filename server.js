const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./auth/authRoutes");
const applications = require('./routes/applications'); // ✅ Use only this one
const notificationRoutes = require("./routes/notificationRoutes");

const app = express(); 
const PORT = process.env.PORT || 5002;

app.use(cors()); 
app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applications); // ✅ Use once only
app.use("/api/notifications", notificationRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/users", userRoutes);     
app.use("/api/auth", authRoutes); 



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

app.get('/', (_req, res) => res.send('Job Application API'));

app.use((err, _req, res, _next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use((err, _req, res, _next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: err.message, stack: err.stack });
});

