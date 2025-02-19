const User = require("../models/User");
const sendOTP = require("../utils/mailer"); // Import mailer function
const { ALLOWED_GOV_EMAILS } = require("../config");

const otpStore = {}; // Temporary store for OTPs

const sendOtp = async (req, res) => {
  const { email, role } = req.body;
  
  if (!email) return res.status(400).json({ message: "Email is required" });
  
  // For government employees (non-citizens), verify that the email is authorized
  if (role && role.toLowerCase() !== "citizen") {
    if (!ALLOWED_GOV_EMAILS.includes(email)) {
      return res.status(401).json({ message: "Email is not authorized for government registration" });
    }
  }
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Store OTP for 5 minutes
  otpStore[email] = { otp, expiresAt: Date.now() + 300000 };
  
  // Send OTP via email using your mailer function
  await sendOTP(email, otp);
  
  res.status(200).json({ message: "OTP sent successfully" });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  if (!otpStore[email] || otpStore[email].expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }
  
  if (otpStore[email].otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  
  delete otpStore[email]; // Remove OTP after successful verification
  
  res.status(200).json({ message: "OTP verified successfully" });
};

module.exports = { sendOtp, verifyOtp };
