const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require("../middleware/auths");
const isAdmin = require('../middleware/isAdmin');

// ✅ Accept user
router.put('/:id/accept', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true }
    );
    res.json({ success: true, message: "User accepted successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Reject user
router.put('/:id/reject', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    res.json({ success: true, message: "User rejected successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
