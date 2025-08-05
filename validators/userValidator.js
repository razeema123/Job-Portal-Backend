const Joi = require("joi");

exports.signupSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  }),
  age: Joi.number().integer().min(0).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age cannot be negative",
    "any.required": "Age is required"
  })
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});
