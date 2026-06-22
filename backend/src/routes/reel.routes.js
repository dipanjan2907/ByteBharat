const express = require("express");
const multer = require("multer");
const path = require("path");
const reelController = require("../controllers/reel.controller");
const { authMiddleware, optionalAuthMiddleware } = require("../middleware/auth");
const router = express.Router();

// Configure multer to store uploaded reels in the uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // limit to 20MB
});

router.get("/", optionalAuthMiddleware, reelController.getAllReels);
router.post("/create", authMiddleware, upload.single("video"), reelController.createReel);
router.get("/me", authMiddleware, reelController.getMeReels);
router.post("/:id/view", authMiddleware, reelController.incrementViews);
router.post("/:id/like", authMiddleware, reelController.toggleLikeReel);
router.delete("/:id", authMiddleware, reelController.deleteReel);

module.exports = router;
