const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    token = parts[1] || parts[0];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If username is not in the token, fetch it from database for backward compatibility
    if (!decoded.username) {
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found, unauthorized" });
      }
      decoded.username = user.username;
    }

    req.user = decoded; // Contains id and username
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    token = parts[1] || parts[0];
  }

  if (!token) {
    return next(); // Proceed without req.user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.username) {
      const user = await userModel.findById(decoded.id);
      if (user) {
        decoded.username = user.username;
      }
    }
    req.user = decoded;
  } catch (err) {
    console.error("Optional Auth Middleware Error:", err);
  }
  next();
};

module.exports = { authMiddleware, optionalAuthMiddleware };
