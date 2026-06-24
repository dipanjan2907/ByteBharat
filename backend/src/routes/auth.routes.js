const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const getMe = require("../controllers/me");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} = require("../middleware/validation");

router.post("/register", authLimiter, validateRegistration, authController.registerUser);
router.post("/login", authLimiter, validateLogin, authController.loginUser);
router.post("/refresh", authLimiter, authController.refreshTokens);
router.post("/logout", authController.logoutUser);
router.get("/me", getMe);

// User settings routes
router.put("/update-profile", authLimiter, authMiddleware, validateUpdateProfile, userController.updateProfile);
router.put("/change-password", authLimiter, authMiddleware, validateChangePassword, userController.changePassword);
router.delete("/delete-account", authLimiter, authMiddleware, userController.deleteAccount);

module.exports = router;


