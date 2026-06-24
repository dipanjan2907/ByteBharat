const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { authMiddleware } = require("../middleware/auth");
const { validateMongoId } = require("../middleware/validation");
const router = express.Router();

router.use(authMiddleware);

router.get("/", notificationController.getNotifications);
router.delete("/", notificationController.clearAllNotifications);
router.delete("/:id", validateMongoId("id"), notificationController.deleteNotification);

module.exports = router;

