require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const express = require("express");

connectDB();
app.use("/uploads", express.static("uploads"));
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server running on port", process.env.PORT);
});

// const BASE_URL = "http://localhost:5000";

{
  /* <video src={BASE_URL + reel.videoPath} /> */
}
