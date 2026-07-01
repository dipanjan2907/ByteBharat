const mongoose = require("mongoose");

// Helper function to validate email format
const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Helper function to validate username format (alphanumeric and underscores, 3-30 chars)
const isValidUsername = (username) => {
  if (typeof username !== "string") return false;
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username.trim());
};

// Helper function to validate name format (letters, spaces, hyphens, periods, apostrophes, 2-50 chars)
const isValidName = (name) => {
  if (typeof name !== "string") return false;
  const nameRegex = /^[a-zA-Z\s'.-]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Helper function to validate password strength
// Requires: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
const isStrongPassword = (password) => {
  if (typeof password !== "string") return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return passwordRegex.test(password);
};

// Helper function to validate video URL
const isValidUrl = (urlStr) => {
  if (typeof urlStr !== "string") return false;
  try {
    new URL(urlStr);
    return true;
  } catch (err) {
    return false;
  }
};

// Middleware: Validate user registration inputs
const validateRegistration = (req, res, next) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required (name, username, email, password)." });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Name must be between 2 and 50 characters and contain only letters, spaces, hyphens, periods, or apostrophes." });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({ message: "Username must be between 3 and 30 characters and contain only letters, numbers, or underscores." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    });
  }

  // Normalize email and username
  req.body.email = email.trim().toLowerCase();
  req.body.username = username.trim().toLowerCase();
  req.body.name = name.trim();

  next();
};

// Middleware: Validate user login inputs
const validateLogin = (req, res, next) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "Username/Email and password are required." });
  }

  if (typeof emailOrUsername !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid credentials format." });
  }

  req.body.emailOrUsername = emailOrUsername.trim();
  next();
};

// Middleware: Validate profile update inputs
const validateUpdateProfile = (req, res, next) => {
  const { name, username, email } = req.body;

  if (name !== undefined) {
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Name must be between 2 and 50 characters and contain only letters, spaces, hyphens, periods, or apostrophes." });
    }
    req.body.name = name.trim();
  }

  if (username !== undefined) {
    if (!isValidUsername(username)) {
      return res.status(400).json({ message: "Username must be between 3 and 30 characters and contain only letters, numbers, or underscores." });
    }
    req.body.username = username.trim().toLowerCase();
  }

  if (email !== undefined) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    req.body.email = email.trim().toLowerCase();
  }

  next();
};

// Middleware: Validate password change inputs
const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      message: "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    });
  }

  next();
};

// Middleware: Validate reel creation inputs
const validateCreateReel = (req, res, next) => {
  const { title } = req.body;
  const videoUrl = req.body.videoUrl;

  if (!title || typeof title !== "string" || title.trim().length < 3 || title.trim().length > 150) {
    return res.status(400).json({ message: "Title is required and must be between 3 and 150 characters." });
  }

  // If a file is uploaded, we don't need a videoUrl, otherwise videoUrl is required
  if (!req.file && !videoUrl) {
    return res.status(400).json({ message: "Either a video file or a video URL is required." });
  }

  if (videoUrl && !isValidUrl(videoUrl)) {
    return res.status(400).json({ message: "Please provide a valid video source URL." });
  }

  // Normalize fields
  req.body.title = title.trim();
  next();
};

// Middleware: Validate MongoDB ObjectId parameter
const validateMongoId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid ID format for parameter: ${paramName}` });
    }
    next();
  };
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateCreateReel,
  validateMongoId,
};
