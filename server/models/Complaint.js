// models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  // Reference to the citizen who submitted the complaint
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Image details
  imageUrl: { type: String, required: true },
  // Complaint description provided by the citizen
  description: { type: String },
  // Location data (could be an address string or GeoJSON coordinates)
  location: { type: mongoose.Schema.Types.Mixed, required: true },
  
  // Data returned from your Flask model processing
  flaskData: {
    Muqqadam_name: { type: String },
    SI_no: { type: String },
    clean_street_probability: { type: Number },
    garbage_probability: { type: Number },
    not_street_probability: { type: Number },
    prediction: { type: String },
    ward_name: { type: String },
    ward_number: { type: Number }
  },
  
  // Status of the complaint
  status: { type: String, enum: ["pending", "in progress", "completed"], default: "pending" },
  
  // Optional instructions or orders added by the SI
  siInstructions: { type: String },
  
  // Reference to the government employee (Muqaddam) assigned by the SI
  assignedMuqaddam: { type: mongoose.Schema.Types.ObjectId, ref: "GovEmployee" },
  
  // Array to hold worker assignment details
  workerAssignments: [{
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "GovEmployee" },
    category: { type: String },
    assignedAt: { type: Date, default: Date.now }
  }],
  
  // URL or file path of the post-cleaning image uploaded by the worker
  postCleaningImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
