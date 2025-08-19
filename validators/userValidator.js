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

// Login Validation
exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required"
  })
});

// Profile Save Validation
exports.userSchema = Joi.object({
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

