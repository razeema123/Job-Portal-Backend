const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/signUpLogin");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/userValidator");
const { verifyToken, authorizeRoles } = require("../middleware/auths");
const User = require("../models/User");

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);


router.get("/users", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // ✅ Block check
  if (user.isBlocked) {
    return res.status(403).json({ message: 'Your account is blocked. Contact support.' });
  }
});

module.exports = router;
