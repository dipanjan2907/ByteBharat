const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const getMe = require("../controllers/me");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.refreshTokens);
router.post("/logout", authController.logoutUser);
router.get("/me", getMe);

// User settings routes
router.put("/update-profile", authMiddleware, userController.updateProfile);
router.put("/change-password", authMiddleware, userController.changePassword);
router.delete("/delete-account", authMiddleware, userController.deleteAccount);

module.exports = router;

