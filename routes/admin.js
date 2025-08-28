 const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auths");
const isAdmin = require("../middleware/isAdmin");

// ✅ Accept user
router.put("/users/:id/accept", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User accepted successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Reject user
router.put("/users/:id/reject", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User rejected successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Block user
router.put("/users/:id/block", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User blocked successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Unblock user
router.put("/users/:id/unblock", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User unblocked successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
