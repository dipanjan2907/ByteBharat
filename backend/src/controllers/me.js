const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function getMe(req, res) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      token = parts[1] || parts[0];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Streak Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastActiveDate) {
      user.streakCount = 1;
      user.lastActiveDate = new Date();
    } else {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastActive.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streakCount += 1;
        user.lastActiveDate = new Date();
      } else if (diffDays > 1) {
        user.streakCount = 1;
        user.lastActiveDate = new Date();
      } else if (diffDays === 0) {
        user.lastActiveDate = new Date();
      }
    }
    await user.save();

    return res.status(200).json({
      message: "User fetched successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        streakCount: user.streakCount,
        lastActiveDate: user.lastActiveDate,
      },
    });
  } catch (err) {
    console.error("GetMe error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = getMe;
