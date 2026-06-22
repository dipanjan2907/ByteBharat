const notificationModel = require("../models/notification.model");

async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await notificationModel
      .find({ recipient: userId })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function clearAllNotifications(req, res) {
  try {
    const userId = req.user.id;
    await notificationModel.deleteMany({ recipient: userId });
    res.status(200).json({ message: "All notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteNotification(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationModel.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this notification" });
    }

    await notificationModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getNotifications,
  clearAllNotifications,
  deleteNotification,
};
