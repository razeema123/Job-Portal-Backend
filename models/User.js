const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: { type: String, enum:["admin", "recruiter", "user"], default: "user" },
  isBlocked: { type: Boolean, default: false },
  resetOTP: String,
  resetOTPExpiry: Date,
  

  // New profile fields
  title: { type: String },
  phone: { type: String },
  education: { type: String },
  experience: { type: String },
  skills: { type: [String], default: [] },
  about: { type: String },
  resumePath: { type: String }
}, { strict: true });


module.exports = mongoose.model("User", userSchema);
