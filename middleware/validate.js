module.exports = (schema) => (req, res, next) => {
  if (!schema || typeof schema.validate !== "function") {
    return res.status(500).json({
      error: "Validation schema is missing or invalid"
    });
  }

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: error.details.map(d => d.message).join(", ")
    });
  }

  next();
};
