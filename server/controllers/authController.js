// controllers/authController.js
const User = require("../models/User");
const GovEmployee = require("../models/GovEmployee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/mailer"); // Ensure this file exists

const otpStore = {};

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtp = async (req, res) => {
  const { email, role } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  
  // If role is provided and isn't citizen, you might check if the email is allowed (if needed)
  // (Assuming you have a config for allowed emails)
  // if (role && role.toLowerCase() !== "citizen") { ... }
  
  const otp = generateOtp();
  otpStore[email] = { otp, expiresAt: Date.now() + 300000 }; // OTP valid for 5 minutes

  await sendOTP(email, otp); // Send OTP via email (ensure this function exists)
  res.status(200).json({ message: "OTP sent successfully" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!otpStore[email] || otpStore[email].expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }
  if (otpStore[email].otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  delete otpStore[email];
  res.status(200).json({ message: "OTP verified successfully" });
};

exports.loginUnified = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token, role: user.role, user });
    }

    let govEmployee = await GovEmployee.findOne({ email });
    if (govEmployee) {
      const isMatch = await bcrypt.compare(password, govEmployee.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: govEmployee._id, role: govEmployee.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token, role: govEmployee.role, user: govEmployee });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Unified login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
