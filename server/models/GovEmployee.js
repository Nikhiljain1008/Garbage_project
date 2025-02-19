// models/GovEmployee.js
const mongoose = require("mongoose");

const govEmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["CSI", "DSI", "SI", "muqaddam", "worker"],
    required: true 
  },
  ward: { type: String }, // Applicable for SI and muqaddam
}, { timestamps: true });

module.exports = mongoose.model("GovEmployee", govEmployeeSchema);
