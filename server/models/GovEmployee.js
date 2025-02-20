


const mongoose = require("mongoose");

const govEmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["CSI", "DSI", "SI", "muqaadam", "worker"],
    required: true 
  },
  ward: { type: String },
  identifier: { type: String, required: true }
}, { timestamps: true });

// This creates and exports a Mongoose model named "GovEmployee"
module.exports = mongoose.model("GovEmployee", govEmployeeSchema);
