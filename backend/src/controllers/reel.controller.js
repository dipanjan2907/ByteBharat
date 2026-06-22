const reelsModel = require("../models/reels.model");
const userModel = require("../models/user.model");
const notificationModel = require("../models/notification.model");

async function getAllReels(req, res) {
  try {
    const { tag } = req.query;
    let query = {};
    if (tag) {
      // Case-insensitive exact match
      query.tags = { $regex: new RegExp(`^${tag}$`, "i") };
    }
    const reels = await reelsModel.find(query).sort({ createdAt: -1 }).limit(20).lean();
    const userId = req.user?.id;
    const reelsWithLikeStatus = reels.map(reel => ({
      ...reel,
      hasLiked: userId ? (reel.likedBy || []).includes(userId) : false
    }));
    res.status(200).json(reelsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching reels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createReel(req, res) {
  try {
    const { username, title } = req.body;
    let videoUrl = req.body.videoUrl;
    let tags = [];

    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        if (typeof req.body.tags === "string") {
          tags = req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
        } else if (Array.isArray(req.body.tags)) {
          tags = req.body.tags;
        }
      }
    }

    // If a physical file is uploaded via multer
    if (req.file) {
      const port = process.env.PORT || 5000;
      videoUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    }

    if (!videoUrl) {
      return res.status(400).json({ message: "Video source is required" });
    }

    const reel = await reelsModel.create({ creator: username, title, videoUrl, tags });

    // Create notifications for all other users
    try {
      const users = await userModel.find({ _id: { $ne: req.user.id } });
      if (users.length > 0) {
        const notifications = users.map(u => ({
          recipient: u._id,
          sender: username,
          type: "reel_upload",
          reel: reel._id,
          message: `${username} uploaded a new reel: "${title}"`,
        }));
        await notificationModel.insertMany(notifications);
      }
    } catch (notifError) {
      console.error("Error creating notifications on reel upload:", notifError);
    }

    res.status(201).json(reel);
  } catch (error) {
    console.error("Error creating reel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getMeReels(req, res) {
  try {
    const username = req.user.username; // extracted from authMiddleware
    const userId = req.user.id;
    const reels = await reelsModel.find({ creator: username }).sort({ createdAt: -1 }).lean();
    const reelsWithLikeStatus = reels.map(reel => ({
      ...reel,
      hasLiked: (reel.likedBy || []).includes(userId)
    }));
    res.status(200).json(reelsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching user reels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteReel(req, res) {
  try {
    const { id } = req.params;
    const username = req.user.username; // extracted from authMiddleware

    const reel = await reelsModel.findById(id);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    if (reel.creator !== username) {
      return res.status(403).json({ message: "Unauthorized to delete this reel" });
    }

    await reelsModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Reel deleted successfully" });
  } catch (error) {
    console.error("Error deleting reel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function incrementViews(req, res) {
  try {
    const { id } = req.params;
    const reel = await reelsModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }
    res.status(200).json({ views: reel.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function toggleLikeReel(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reel = await reelsModel.findById(id);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    const hasLiked = reel.likedBy && reel.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      reel.likedBy = reel.likedBy.filter(uid => uid !== userId);
      reel.likes = Math.max(0, reel.likes - 1);
    } else {
      // Like
      if (!reel.likedBy) reel.likedBy = [];
      reel.likedBy.push(userId);
      reel.likes += 1;
    }

    await reel.save();
    res.status(200).json({ likes: reel.likes, liked: !hasLiked });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllReels, createReel, getMeReels, deleteReel, incrementViews, toggleLikeReel };
