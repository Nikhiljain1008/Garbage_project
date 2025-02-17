
const User = require("../models/User");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

exports.uploadImage = async (req, res) => {
    console.log("✅ Request received in imageController.js");
    console.log("📩 Request Body:", req.body);
    console.log("🖼 Uploaded File:", req.file);
    console.log("👤 User Object:", req.user);

    const { location, description } = req.body;
    const userId = req.user?._id; // Ensure this is a valid ID

    if (!req.file) {
        console.log("🚨 No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const filePath = req.file.path;

    try {
        console.log("🚀 Sending image to Flask API for classification...");
        const form = new FormData();
        form.append("image", fs.createReadStream(filePath));

        const flaskResponse = await axios.post("http://127.0.0.1:5001/predict", form, {
            headers: { ...form.getHeaders() }
        });
        const classification = flaskResponse.data;

        console.log("🧪 Flask API Response:", classification);

        // Find user in MongoDB
        const user = await User.findById(userId);
        if (!user) {
            console.log("🚨 User not found in DB:", userId);
            fs.unlinkSync(filePath); // Clean up file
            return res.status(404).json({ message: "User not found" });
        }

        // Store image details in the user object
        user.images.push({
            imageUrl,
            location,
            description,
            garbageProbability: classification.garbage_probability,
            cleanStreetProbability: classification.clean_street_probability
        });

        await user.save();

        console.log("✅ Image data saved successfully in user profile");

        // Delete the image after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error("⚠️ Error deleting file:", err);
        });

        res.status(201).json({ message: "Image uploaded successfully", classification });

    } catch (error) {
        console.error("❌ Error processing image:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
