const User = require("../models/User");
const Complaint = require("../models/Complaint"); // Import the Complaint model
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

exports.uploadImage = async (req, res) => {
  console.log("✅ Request received in imageControllers.js");
  console.log("📩 Request Body:", req.body);
  console.log("🖼 Uploaded File:", req.file);
  console.log("👤 User Object:", req.user);

<<<<<<< HEAD
  const { location, description } = req.body;
  const userId = req.user?._id; // Ensure this is a valid ID
=======
    const { location, description, latitude, longitude } = req.body;
    const userId = req.user?._id;
>>>>>>> 3b105881638c2af7e6a3b860e3db1a08a7ca4bff

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
      headers: { ...form.getHeaders() },
      timeout: 10000 // 10-second timeout
    });
    console.log("✅ Received response from Flask API");
    const classification = flaskResponse.data;
    console.log("🧪 Flask API Response:", classification);

    // Check if garbage probability is high enough (adjust threshold as needed)
    if (classification.garbage_probability < 50) {
      console.log("🟢 Image is not classified as garbage. Deleting the file...");
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Image does not contain garbage. Not stored." });
    }

<<<<<<< HEAD
    // Optionally, verify that the user exists (if needed)
    const user = await User.findById(userId);
    if (!user) {
      console.log("🚨 User not found in DB:", userId);
      fs.unlinkSync(filePath);
      return res.status(404).json({ message: "User not found" });
=======
    const imageUrl = `/uploads/${req.file.filename}`;
    const filePath = req.file.path;
    
    try {
        console.log("🚀 Sending image & coordinates to Flask API for classification...");
        const form = new FormData();
        form.append("image", fs.createReadStream(filePath));
        form.append("latitude", latitude);
        form.append("longitude", longitude);

        const flaskResponse = await axios.post("http://127.0.0.1:5001/predict", form, {
            headers: { ...form.getHeaders() }
        });

        const classification = flaskResponse.data;
        console.log("🧪 Flask API Response:", classification);

        if (classification.garbage_probability < 50) { 
            console.log("🟢 Image is not classified as garbage. Deleting the file...");
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "Image does not contain garbage. Not stored." });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log("🚨 User not found in DB:", userId);
            fs.unlinkSync(filePath);
            return res.status(404).json({ message: "User not found" });
        }

        user.images.push({
            imageUrl,
            location,
            description,
            garbageProbability: classification.garbage_probability,
            cleanStreetProbability: classification.clean_street_probability,
            status: "pending"
        });

        await user.save();
        console.log("✅ Image data saved successfully in user profile");

        res.status(201).json({ message: "Image uploaded successfully", classification });

    } catch (error) {
        console.error("❌ Error processing image:", error);
        res.status(500).json({ message: "Internal server error." });
>>>>>>> 3b105881638c2af7e6a3b860e3db1a08a7ca4bff
    }

    // Create a new complaint using the Complaint model
    const newComplaint = new Complaint({
      citizen: userId,            // Reference to the citizen who submitted the complaint
      imageUrl,                   // Image URL stored from uploads folder
      location,                   // Location string (or object) provided by the user
      description,                // Complaint description provided by the citizen
      flaskData: classification,  // Store all classification data from the Flask API
      status: "pending"           // Initial complaint status
    });

    const savedComplaint = await newComplaint.save();
    console.log("✅ Complaint saved successfully:", savedComplaint);

    // Optionally, delete the file from disk after storing its data, if you're storing images elsewhere
    // fs.unlinkSync(filePath);

    res.status(201).json({ message: "Complaint submitted successfully", complaint: savedComplaint });
  } catch (error) {
    console.error("❌ Error processing image:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.getUserImages = async (req, res) => {
  // This function can be adjusted if needed to fetch complaints rather than user images,
  // or you can implement a separate endpoint to fetch complaint data.
  console.log("📸 Fetching complaints for user:", req.user._id);
  try {
    const complaints = await Complaint.find({ citizen: req.user._id });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("❌ Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
