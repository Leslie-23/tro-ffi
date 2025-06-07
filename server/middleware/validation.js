import Joi from "joi";

export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(100) // Matches your VARCHAR(100) schema
      .required()
      .pattern(/^[a-zA-Z0-9_]+$/) // Basic username pattern
      .messages({
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),
    name: Joi.string()
      .min(3)
      .max(100) // Matches your VARCHAR(100) schema
      .required(),
    email: Joi.string()
      .email()
      .max(100) // Matches your VARCHAR(100) schema
      .required(),
    password: Joi.string()
      .min(8)
      .max(512) // Matches your VARCHAR(512) schema
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/) // Basic password complexity
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
    phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(20) // Matches your VARCHAR(20) schema
      .required()
      .messages({
        "string.pattern.base": "Phone number can only contain digits",
      }),
    profile_image: Joi.string().uri().optional(),
    is_driver: Joi.boolean().default(false).optional(),
  }).options({ abortEarly: false }); // Show all validation errors at once

  const { error } = schema.validate(req.body, {
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((d) => ({
        field: d.path[0],
        message: d.message.replace(/['"]/g, ""),
      })),
    });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    identifier: Joi.string().required().messages({
      "string.empty": "Email or username is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((d) => ({
        field: d.path[0],
        message: d.message.replace(/['"]/g, ""),
      })),
    });
  }
  next();
};

export const validateBus = (req, res, next) => {
  const requiredFields = ["plate_number", "capacity"];
  const missing = requiredFields.filter((field) => !req.body[field]);

  if (missing.length) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields: missing,
    });
  }
  next();
};
