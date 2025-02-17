const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/imageControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

console.log("📌 imageRoutes.js loaded");

// Multer storage configuration (ensures files are saved in 'uploads/')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("📂 Storing file in 'uploads/' directory");
        cb(null, "uploads/"); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        console.log("🖼 Generated filename:", filename);
        cb(null, filename);
    }
});
const upload = multer({ storage });

// ✅ Route to handle image upload (Now with authMiddleware)
router.post("/upload", authMiddleware, upload.single("image"), (req, res, next) => {
    console.log("📥 Image upload request received");
    console.log("🔄 Passing control to uploadImage controller...");
    next();
}, uploadImage);

module.exports = router;
