const User = require("../models/User");
const sendOTP = require("../utils/mailer"); // Import mailer function
const { ALLOWED_GOV_EMAILS } = require("../config");

const otpStore = {}; // Temporary store for OTPs

const sendOtp = async (req, res) => {
<<<<<<< HEAD
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
=======

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    otpStore[email] = { otp, expiresAt: Date.now() + 300000 }; // Store OTP for 5 min
    await sendOTP(email, otp); // Send OTP via email
    res.status(200).json({ message: "OTP sent successfully" });

>>>>>>> 3b105881638c2af7e6a3b860e3db1a08a7ca4bff
};



const verifyOtp = async (req, res) => {
<<<<<<< HEAD
  const { email, otp } = req.body;
  
  if (!otpStore[email] || otpStore[email].expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }
  
  if (otpStore[email].otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  
  delete otpStore[email]; // Remove OTP after successful verification
  
  res.status(200).json({ message: "OTP verified successfully" });
=======

    const { email, otp } = req.body;
    if (!otpStore[email] || otpStore[email].expiresAt < Date.now()) {
        return res.status(400).json({ message: "OTP expired or invalid" });
    }
    if (otpStore[email].otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    delete otpStore[email]; // Remove OTP after successful verification
    res.status(200).json({ message: "OTP verified successfully" });

>>>>>>> 3b105881638c2af7e6a3b860e3db1a08a7ca4bff
};

module.exports = { sendOtp, verifyOtp };
