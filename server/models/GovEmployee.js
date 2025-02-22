


// const mongoose = require("mongoose");

// const govEmployeeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["CSI", "DSI", "SI", "muqaadam", "worker"],
//     required: true 
//   },
//   ward: { type: String },
//   identifier: { type: String, required: true }
// }, { timestamps: true });

// // This creates and exports a Mongoose model named "GovEmployee"
// module.exports = mongoose.model("GovEmployee", govEmployeeSchema);

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
  identifier: { type: String, required: true },
  muqaddamKey: { type: String },  // Only for Muqaddam & Workers
  category: { 
    type: String, 
    enum: ["Street Sweepers", "Garbage Collectors"], 
    required: function () { 
      return this.role === "worker"; // Required only if role is "worker"
    }
  },
  status: { type: String, enum: ["pending", "approved"], default: "pending" } // Worker approval status
}, { timestamps: true });

module.exports = mongoose.model("GovEmployee", govEmployeeSchema);

