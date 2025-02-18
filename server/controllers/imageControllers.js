
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

    const imageUrl = `server/uploads/${req.file.filename}`;
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

        // Check if garbage probability is high enough
        if (classification.garbage_probability < 50) { // Adjust threshold if needed
            console.log("🟢 Image is not classified as garbage. Deleting the file...");
            fs.unlinkSync(filePath); // Remove image from uploads folder
            return res.status(400).json({ message: "Image does not contain garbage. Not stored." });
        }

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

        res.status(201).json({ message: "Image uploaded successfully", classification });

    } catch (error) {
        console.error("❌ Error processing image:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getUserImages = async (req, res) => {
    console.log("📸 Fetching images for user:", req.user._id);

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log("🚨 User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Extract only necessary fields from each image
        const images = user.images.map(img => ({
            imageUrl: `${req.protocol}://${req.get("host")}${img.imageUrl}`, 
            garbageProbability: img.garbageProbability,
            location: img.location,
            description: img.description
        }));

        console.log(images);
        res.status(200).json({ images });
    } catch (error) {
        console.error("❌ Error fetching images:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

