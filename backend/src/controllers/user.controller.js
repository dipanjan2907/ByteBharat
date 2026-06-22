const userModel = require("../models/user.model");
const reelsModel = require("../models/reels.model");
const bcrypt = require("bcrypt");

async function updateProfile(req, res) {
  try {
    const { name, username, email } = req.body;
    const userId = req.user.id;

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new username is already taken by someone else
    if (username && username !== user.username) {
      const usernameExists = await userModel.findOne({ username });
      if (usernameExists) {
        return res.status(409).json({ message: "Username is already taken" });
      }
    }

    // Check if new email is already taken by someone else
    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email is already taken" });
      }
    }

    const oldUsername = user.username;

    // Update user properties
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    // If username changed, update their uploaded reels' creator name
    if (username && username !== oldUsername) {
      await reelsModel.updateMany(
        { creator: oldUsername },
        { creator: username }
      );
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        streakCount: user.streakCount,
        lastActiveDate: user.lastActiveDate,
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;

    // Delete user
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's reels
    await reelsModel.deleteMany({ creator: deletedUser.username });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  updateProfile,
  changePassword,
  deleteAccount,
};
