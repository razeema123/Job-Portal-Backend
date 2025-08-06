const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');

const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const path = require('path');


dotenv.config();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./auth/authRoutes");

const app = express(); 

const PORT = process.env.PORT || 5002;

app.use(cors()); 
app.use(express.json());


app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);


app.use('/api/jobs', jobRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/users", userRoutes);     
app.use("/api/auth", authRoutes);  

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


app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
