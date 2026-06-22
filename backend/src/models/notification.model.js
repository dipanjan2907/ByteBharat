const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "reel_upload",
  },
  reel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "reels",
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;
