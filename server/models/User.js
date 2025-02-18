const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    images: [
        {
            imageUrl: String,
            location: String,
            description: String,
            garbageProbability: Number,
            cleanStreetProbability: Number,
            status: {
                type: String,
                default: "pending" // Default value is "pending"
            },
            uploadedAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
