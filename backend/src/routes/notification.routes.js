const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.use(authMiddleware);

router.get("/", notificationController.getNotifications);
router.delete("/", notificationController.clearAllNotifications);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
