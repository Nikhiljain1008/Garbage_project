const express = require("express");
const { sendOtp, verifyOtp } = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// OTP endpoints using controller functions
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Registration endpoint (No password hashing)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate password input
        if (!password || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid password format" });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Save the new user (Plaintext password, NOT RECOMMENDED)
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login endpoint (No bcrypt)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare raw password (Security risk)
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const payload = { userId: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
