import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GovRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "CSI", // Default role
    name: "",
    email: "",
    password: "",
    identifier: "", // Unique identifier for government roles
    ward: "", // Ward selection
    siIdentifier: "", // SI linkage field
    muqaddamKey: "", // Only for workers
    category: "", // Worker category
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Reset SI identifier when the role is changed to something other than "muqaddam"
      ...(name === "role" && value !== "muqaddam" ? { siIdentifier: "" } : {}),
    }));
  };
  

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
        role: formData.role,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formData.email,
        otp,
      });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    }
  };

  // Step 3: Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
  
    // Prepare registration data
    const registrationData = { ...formData };
  
    // Remove category and muqaddamKey if role is not "worker"
    if (formData.role !== "worker") {
      delete registrationData.category;
      delete registrationData.muqaddamKey;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/api/govEmployees/register2", registrationData);
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gov Employee Register</h1>

        {error && <div className="mb-4 text-center text-red-600 font-medium">{error}</div>}
        {message && <div className="mb-4 text-center text-green-600 font-medium">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-gray-700 mb-1">Select Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CSI">CSI</option>
                <option value="DSI">DSI</option>
                <option value="SI">SI</option>
                <option value="muqaadam">Muqaddam</option>
                <option value="worker">Workers</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Identifier */}
            <div>
              <label htmlFor="identifier" className="block text-gray-700 mb-1">Identifier</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ward (Optional) */}
            <div>
              <label htmlFor="ward" className="block text-gray-700 mb-1">Ward</label>
              <input
                id="ward"
                name="ward"
                type="text"
                value={formData.ward}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
             {formData.role.toLowerCase() === 'muqaddam' && (
              <div>
                <label htmlFor="siIdentifier" className="block text-gray-700 mb-1">SI Identifier</label>
                <input
                  id="siIdentifier"
                  name="siIdentifier"
                  type="text"
                  placeholder="Enter the SI identifier (e.g., SI1)"
                  value={formData.siIdentifier}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
            )}
           {/* SI Identifier (Only for Muqaddam) */}
{formData.role === "muqaddam" && (
  <div>
    <label htmlFor="siIdentifier" className="block text-gray-700 mb-1">SI Identifier</label>
    <input
      id="siIdentifier"
      name="siIdentifier"
      type="text"
      placeholder="Enter the SI identifier (e.g., SI1)"
      value={formData.siIdentifier || ""}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded p-2"
    />
  </div>
)}


            {/* Muqaddam Key (Only for Workers) */}
            {formData.role === "worker" && (
              <>
                <div>
                  <label htmlFor="muqaddamKey" className="block text-gray-700 mb-1">Muqaddam Key</label>
                  <input
                    id="muqaddamKey"
                    name="muqaddamKey"
                    type="text"
                    value={formData.muqaddamKey}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Selection (Only for Workers) */}
                <div>
                  <label htmlFor="category" className="block text-gray-700 mb-1">Worker Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Street Sweepers">Street Sweepers</option>
                    <option value="Garbage Collectors">Garbage Collectors</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
              Send OTP
            </button>
          </form>
        )}

{step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-gray-700 mb-1">Enter OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">Set Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition">
              Complete Registration
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default GovRegister;


