const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { verifyToken } = require("../middleware/auths");

// 📌 Get unread count
router.get("/:userId/unread-count", verifyToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.params.userId, 
      read: false 
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all notifications for a user
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Mark all as read
router.put("/:userId/mark-read", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.params.userId }, { $set: { read: true } });
    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Create a notification (when recruiter shortlists/rejects)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = await Notification.create({ user: userId, message });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
