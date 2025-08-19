const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const { userSchema } = require("../validators/userValidator");
const { verifyToken } = require("../middleware/auths");
const validate = require("../middleware/validate");

/* -------------------- MULTER SETUP FOR RESUME UPLOAD -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });




     
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// GET logged-in user's profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Profile not found" });
    res.json(user);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



// LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});   // 👈 properly closed now



  // UPLOAD resume for logged-in user
  router.post(
    "/profile/upload-resume",
    verifyToken,
    upload.single("resume"),
    async (req, res) => {
      try {
        if (!req.file)
          return res.status(400).json({ error: "No file uploaded" });

        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          {
            resumePath: `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`
          },
          { new: true }
        ).select("-password");

        res.json({
          message: "Resume uploaded successfully",
          user: updatedUser,
        });
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    }
  );

/* -------------------- USER ID BASED ROUTES -------------------- */


router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", verifyToken, validate(userSchema), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
