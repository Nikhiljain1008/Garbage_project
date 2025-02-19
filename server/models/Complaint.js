const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  location: { type: mongoose.Schema.Types.Mixed, required: true },
  flaskData: {
    clean_street_probability: { type: Number },
    garbage_probability: { type: Number },
    not_street_probability: { type: Number },
    prediction: { type: String },
    ward_name: { type: String },
    ward_number: { type: Number },
    Muqqadam_name: { type: String },
    SI_no: { type: String }
  },
  status: { type: String, enum: ["pending", "in progress", "completed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
