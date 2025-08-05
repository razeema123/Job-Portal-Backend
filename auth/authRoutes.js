const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/signUpLogin");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/userValidator");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

module.exports = router;
