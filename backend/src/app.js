const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const reelRoutes = require("./routes/reel.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.routes");
const { apiLimiter } = require("./middleware/rateLimiter");
const app = express();

// Trust reverse proxy headers (e.g. X-Forwarded-For) for rate limiting client IPs
app.set("trust proxy", 1);

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Apply general API rate limiter to all API endpoints
app.use("/api", apiLimiter);

// Serve uploaded files statically
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reels", reelRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;

