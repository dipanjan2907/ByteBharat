const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  creator: { type: String, required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const reelsModel = mongoose.model("reels", reelSchema);
module.exports = reelsModel;
