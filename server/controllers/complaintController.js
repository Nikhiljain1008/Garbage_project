
const Complaint = require("../models/Complaint");

// SI: Get pending complaints for the SI's ward/identifier
// exports.getSiComplaints = async (req, res) => {
//   try {
//     // Assume the SI's unique identifier is stored in req.user.identifier
//     const siIdentifier = req.user.identifier;
//     // Fetch complaints where flaskData.SI_no matches the SI's identifier and status is "pending"
//     const complaints = await Complaint.find({ "flaskData.SI_no": siIdentifier, status: "pending" });
//     res.json({ complaints });
//   } catch (error) {
//     console.error("Error fetching SI complaints:", error);
//     res.status(500).json({ message: "Error fetching complaints", error: error.message });
//   }
// };

exports.getSiComplaints = async (req, res) => {
  try {
    if (!req.user || !req.user.identifier) {
      return res.status(400).json({ message: "SI identifier is missing" });
    }

    const siIdentifier = req.user.identifier;
    const complaints = await Complaint.find({ "flaskData.SI_no": siIdentifier, status: "pending" });

    res.json({ complaints });
  } catch (error) {
    console.error("❌ Error fetching SI complaints:", error);
    res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};


// SI: Forward a complaint to a Muqaddam
// controllers/complaintController.js
// controllers/complaintController.js
// exports.assignMuqaddam = async (req, res) => {
//   try {
//     const complaintId = req.params.complaintId;
//     const { muqaddamId, siInstructions } = req.body;
//     if (!muqaddamId) {
//       return res.status(400).json({ message: "Muqaddam ID is required" });
//     }
//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       complaintId,
//       { assignedMuqaddam: muqaddamId, siInstructions, status: "in progress" },
//       { new: true }
//     );
//     res.json({ message: "Complaint forwarded to Muqaddam", complaint: updatedComplaint });
//   } catch (error) {
//     console.error("Error assigning Muqaddam:", error);
//     res.status(500).json({ message: "Error assigning Muqaddam", error: error.message });
//   }
// };

const mongoose = require("mongoose");

exports.assignMuqaddam = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { muqaddamId, siInstructions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    if (!muqaddamId) {
      return res.status(400).json({ message: "Muqaddam ID is required" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedMuqaddam: muqaddamId, siInstructions, status: "in progress" },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint forwarded to Muqaddam", complaint: updatedComplaint });
  } catch (error) {
    console.error("❌ Error assigning Muqaddam:", error);
    res.status(500).json({ message: "Error assigning Muqaddam", error: error.message });
  }
};




// Muqaddam: Get complaints assigned to them
exports.getMuqaddamComplaints = async (req, res) => {
  try {
    // Assume the logged-in Muqaddam's _id is in req.user._id
    const muqaddamId = req.user._id;
    const complaints = await Complaint.find({ assignedMuqaddam: muqaddamId, status: "in progress" });
    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching Muqaddam complaints:", error);
    res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};

// Muqaddam: Assign a worker to a complaint
// exports.assignWorker = async (req, res) => {
//   try {
//     const complaintId = req.params.complaintId;
//     const { workerId, category } = req.body;
//     const complaint = await Complaint.findById(complaintId);
//     if (!complaint) return res.status(404).json({ message: "Complaint not found" });

//     // Append worker assignment details
//     complaint.workerAssignments.push({ workerId, category, assignedAt: new Date() });
//     await complaint.save();

//     res.json({ message: "Worker assigned successfully", complaint });
//   } catch (error) {
//     console.error("Error assigning worker:", error);
//     res.status(500).json({ message: "Error assigning worker", error: error.message });
//   }
// };

exports.assignWorker = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { workerId, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.workerAssignments.push({ workerId, category, assignedAt: new Date() });
    await complaint.save();

    res.json({ message: "Worker assigned successfully", complaint });
  } catch (error) {
    console.error("❌ Error assigning worker:", error);
    res.status(500).json({ message: "Error assigning worker", error: error.message });
  }
};


// Worker: Mark complaint as completed (upload post-cleaning image)
// exports.completeComplaint = async (req, res) => {
//   try {
//     const complaintId = req.params.complaintId;
//     const { postCleaningImage } = req.body;

//     // Optionally, you could send the image to the Flask API for verification here.
//     // For now, update status to "completed" and store the post-cleaning image URL.
//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       complaintId,
//       { postCleaningImage, status: "completed" },
//       { new: true }
//     );
//     res.json({ message: "Complaint marked as completed", complaint: updatedComplaint });
//   } catch (error) {
//     console.error("Error completing complaint:", error);
//     res.status(500).json({ message: "Error completing complaint", error: error.message });
//   }
// };


exports.completeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { postCleaningImage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    if (!postCleaningImage || !postCleaningImage.startsWith("http")) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { postCleaningImage, status: "completed" },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint marked as completed", complaint: updatedComplaint });
  } catch (error) {
    console.error("❌ Error completing complaint:", error);
    res.status(500).json({ message: "Error completing complaint", error: error.message });
  }
};
