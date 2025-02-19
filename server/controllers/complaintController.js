const Complaint = require("../models/Complaint");

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    // Expecting: citizen, imageUrl, location, description, flaskData, etc.
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint: savedComplaint });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Error creating complaint", error });
  }
};

// SI: Get pending complaints for a ward
exports.getSiComplaints = async (req, res) => {
  try {
    const ward = req.query.ward;
    const complaints = await Complaint.find({ "flaskData.ward_number": Number(ward), status: "pending" });
    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching SI complaints:", error);
    res.status(500).json({ message: "Error fetching complaints", error });
  }
};

// SI: Forward complaint to Muqaddam
exports.assignMuqaddam = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const { muqaddamId, siInstructions } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedMuqaddam: muqaddamId, siInstructions, status: "in progress" },
      { new: true }
    );
    res.json({ message: "Complaint forwarded to Muqaddam", complaint: updatedComplaint });
  } catch (error) {
    console.error("Error assigning Muqaddam:", error);
    res.status(500).json({ message: "Error assigning Muqaddam", error });
  }
};

// Muqaddam: Get complaints assigned to them
exports.getMuqaddamComplaints = async (req, res) => {
  try {
    const muqaddamId = req.query.muqaddamId;
    const complaints = await Complaint.find({ assignedMuqaddam: muqaddamId, status: "in progress" });
    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching Muqaddam complaints:", error);
    res.status(500).json({ message: "Error fetching complaints", error });
  }
};

// Muqaddam: Assign a worker to a complaint
exports.assignWorker = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const { workerId, category } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.workerAssignments.push({ workerId, category, assignedAt: new Date() });
    await complaint.save();
    res.json({ message: "Worker assigned successfully", complaint });
  } catch (error) {
    console.error("Error assigning worker:", error);
    res.status(500).json({ message: "Error assigning worker", error });
  }
};

// Worker: Mark complaint as completed (upload post-cleaning image)
exports.completeComplaint = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    // For simplicity, assume the postCleaningImage URL is sent in the request body.
    const { postCleaningImage } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { postCleaningImage, status: "completed" },
      { new: true }
    );
    res.json({ message: "Complaint marked as completed", complaint: updatedComplaint });
  } catch (error) {
    console.error("Error completing complaint:", error);
    res.status(500).json({ message: "Error completing complaint", error });
  }
};
