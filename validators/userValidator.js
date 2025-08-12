const Joi = require("joi");

const baseSchema = {
  name: Joi.string().trim().messages({
    "string.empty": "Name is required"
  }),
  email: Joi.string().email().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email"
  }),
  password: Joi.string().min(6).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
};

// Signup schema (name, email, password required)
const signupSchema = Joi.object({
  name: baseSchema.name.required(),
  email: baseSchema.email.required(),
  password: baseSchema.password.required()
});

// Login schema (only email and password required)
const loginSchema = Joi.object({
  email: baseSchema.email.required(),
  password: baseSchema.password.required()
});

module.exports = { signupSchema, loginSchema };
