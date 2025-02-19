const express = require("express");
const multer = require("multer");
const { uploadImage, getUserImages } = require("../controllers/imageControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
console.log("📌 imageRoutes.js loaded");

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    }
});
const upload = multer({ storage });

// Route to upload an image
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

// Route to fetch a user's images
router.get("/my-images", authMiddleware, getUserImages);

module.exports = router;
