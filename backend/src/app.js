const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const reelRoutes = require("./routes/reel.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.routes");
const app = express();

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

// Serve uploaded files statically
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reels", reelRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;
