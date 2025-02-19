const User = require("../models/User");

const sendOTP = require("../utils/mailer"); // Import mailer function



const otpStore = {}; // Temporary store for OTPs

const sendOtp = async (req, res) => {

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    otpStore[email] = { otp, expiresAt: Date.now() + 300000 }; // Store OTP for 5 min
    await sendOTP(email, otp); // Send OTP via email
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
