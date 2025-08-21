const Joi = require("joi");



// Removed incomplete baseSchema definition


// Signup schema
const signupSchema = Joi.object({
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
  })
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});

// Profile Save schema
const userSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required"
  }),
  title: Joi.string().allow(""),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email"
  }),
  phone: Joi.string().allow(""),
  education: Joi.string().allow(""),
  experience: Joi.string().allow(""),
  skills: Joi.array().items(Joi.string()).allow(null),
  about: Joi.string().allow(""),
  resumePath: Joi.string().allow("")
}).unknown(true);

module.exports = { signupSchema, loginSchema, userSchema };