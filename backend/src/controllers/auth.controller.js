const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  hashToken,
  dehashToken,
  generateTokens,
  setCookies,
  REFRESH_SECRET,
} = require("../services/token.service");

async function registerUser(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const isUserExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isUserExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      username,
      email,
      password: hashedPassword,
      streakCount: 1,
      lastActiveDate: new Date(),
    });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshTokens = [hashToken(refreshToken)];
    await user.save();

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
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
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await userModel.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
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

    const { accessToken, refreshToken } = generateTokens(user);

    // Manage refresh token list
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(hashToken(refreshToken));
    if (user.refreshTokens.length > 10) {
      user.refreshTokens.shift();
    }

    await user.save();

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Logged in successfully",
      token: accessToken,
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
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function refreshTokens(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);

    const decryptedTokens = (user?.refreshTokens || []).map((t) =>
      dehashToken(t),
    );

    if (
      !user ||
      !user.refreshTokens ||
      !decryptedTokens.includes(refreshToken)
    ) {
      // Refresh token reuse or compromise detection
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      res.clearCookie("token");
      res.clearCookie("refreshToken");
      return res
        .status(401)
        .json({ message: "Invalid or reused refresh token" });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(user);

    // Rotate token: Remove used token and add new one
    user.refreshTokens = user.refreshTokens.filter(
      (t) => dehashToken(t) !== refreshToken,
    );
    user.refreshTokens.push(hashToken(newRefreshToken));
    if (user.refreshTokens.length > 10) {
      user.refreshTokens.shift();
    }

    await user.save();

    setCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      token: newAccessToken,
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
    console.error("Refresh token verification failed:", err);
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
}

async function logoutUser(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = await userModel.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => dehashToken(t) !== refreshToken,
        );
        await user.save();
      }
    } catch (err) {
      // Ignore verification error on logout
    }
  }
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { registerUser, loginUser, refreshTokens, logoutUser };
