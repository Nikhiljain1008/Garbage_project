// const Complaint = require("../models/Complaint");

// // Create a new complaint
// exports.createComplaint = async (req, res) => {
//   try {
//     // Expecting: citizen, imageUrl, location, description, flaskData, etc.
//     const newComplaint = new Complaint(req.body);
//     const savedComplaint = await newComplaint.save();
//     res.status(201).json({ message: "Complaint submitted successfully", complaint: savedComplaint });
//   } catch (error) {
//     console.error("Error creating complaint:", error);
//     res.status(500).json({ message: "Error creating complaint", error });
//   }
// };

// // SI: Get pending complaints for a ward
// exports.getSiComplaints = async (req, res) => {
//   try {
//     const ward = req.query.ward;
//     const complaints = await Complaint.find({ "flaskData.ward_number": Number(ward), status: "pending" });
//     res.json({ complaints });
//   } catch (error) {
//     console.error("Error fetching SI complaints:", error);
//     res.status(500).json({ message: "Error fetching complaints", error });
//   }
// };

// // SI: Forward complaint to Muqaddam
// exports.assignMuqaddam = async (req, res) => {
//   try {
//     const complaintId = req.params.complaintId;
//     const { muqaddamId, siInstructions } = req.body;
//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       complaintId,
//       { assignedMuqaddam: muqaddamId, siInstructions, status: "in progress" },
//       { new: true }
//     );
//     res.json({ message: "Complaint forwarded to Muqaddam", complaint: updatedComplaint });
//   } catch (error) {
//     console.error("Error assigning Muqaddam:", error);
//     res.status(500).json({ message: "Error assigning Muqaddam", error });
//   }
// };

// // Muqaddam: Get complaints assigned to them
// exports.getMuqaddamComplaints = async (req, res) => {
//   try {
//     const muqaddamId = req.query.muqaddamId;
//     const complaints = await Complaint.find({ assignedMuqaddam: muqaddamId, status: "in progress" });
//     res.json({ complaints });
//   } catch (error) {
//     console.error("Error fetching Muqaddam complaints:", error);
//     res.status(500).json({ message: "Error fetching complaints", error });
//   }
// };

// // Muqaddam: Assign a worker to a complaint
// exports.assignWorker = async (req, res) => {
//   try {
//     const complaintId = req.params.complaintId;
//     const { workerId, category } = req.body;
//     const complaint = await Complaint.findById(complaintId);
//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }
//     complaint.workerAssignments.push({ workerId, category, assignedAt: new Date() });
//     await complaint.save();
//     res.json({ message: "Worker assigned successfully", complaint });
//   } catch (error) {
//     console.error("Error assigning worker:", error);
//     res.status(500).json({ message: "Error assigning worker", error });
//   }
// };

// // Worker: Mark complaint as completed (upload post-cleaning image)
// exports.completeComplaint = async (req, res) => {
//   try {
//     const complaintId = req.params.complaintId;
//     // For simplicity, assume the postCleaningImage URL is sent in the request body.
//     const { postCleaningImage } = req.body;
//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       complaintId,
//       { postCleaningImage, status: "completed" },
//       { new: true }
//     );
//     res.json({ message: "Complaint marked as completed", complaint: updatedComplaint });
//   } catch (error) {
//     console.error("Error completing complaint:", error);
//     res.status(500).json({ message: "Error completing complaint", error });
//   }
// };
const Complaint = require("../models/Complaint");

// SI: Get pending complaints for the SI's ward/identifier
// exports.getSiComplaints = async (req, res) => {
// 	try {
// 		// Assume the SI's unique identifier is stored in req.user.identifier
// 		const siIdentifier = req.user.identifier; 
// 		// Fetch complaints where flaskData.SI_no matches the SI's identifier and status is "pending"
// 		const complaints = await Complaint.find({ "flaskData.SI_no": siIdentifier, status: "pending" });
// 		res.json({ complaints });
// 	} catch (error) {
// 		console.error("Error fetching SI complaints:", error);
// 		res.status(500).json({ message: "Error fetching complaints", error: error.message });
// 	}
// };
// controllers/complaintController.js
// controllers/complaintController.js
// exports.getSiComplaints = async (req, res) => {
//   try {
//     // Assume the SI's unique identifier and ward are stored in req.user
//     const siIdentifier = req.user.identifier;
//     const siWard = req.user.ward; // Ensure this matches the type of flaskData.ward_number (e.g., Number)

//     // Fetch complaints where both the SI identifier and ward match and status is "pending"
//     const complaints = await Complaint.find({
//       "flaskData.SI_no": siIdentifier,
//       "flaskData.ward_number": Number(siWard),
//       status: "pending"
//     });

//     // Transform each complaint's imageUrl from a relative path to a full URL
//     const transformedComplaints = complaints.map(c => {
//       const obj = c.toObject();
//       obj.imageUrl = `${req.protocol}://${req.get("host")}${obj.imageUrl}`;
//       return obj;
//     });

//     res.json({ complaints: transformedComplaints });
//   } catch (error) {
//     console.error("Error fetching SI complaints:", error);
//     res.status(500).json({ message: "Error fetching complaints", error: error.message });
//   }
// };
exports.getSiComplaints = async (req, res) => {
	try {
	  const siIdentifier = req.user.identifier;
	  const siWard = req.user.ward;
  
	  const complaints = await Complaint.find({
		"flaskData.SI_no": siIdentifier,
		"flaskData.ward_number": Number(siWard),
		status: "pending",
	  });
  
	  res.json({ complaints });
	} catch (error) {
	  console.error("Error fetching SI complaints:", error);
	  res.status(500).json({ message: "Error fetching complaints", error: error.message });
	}
  };
// exports.getSiComplaints = async (req, res) => {
// 	try {
// 	  const siIdentifier = req.user.identifier;
// 	  const siWard = req.user.ward;
  
// 	  // Fetch pending complaints
// 	  const pendingComplaints = await Complaint.find({
// 		"flaskData.SI_no": siIdentifier,
// 		"flaskData.ward_number": Number(siWard),
// 		status: "pending"
// 	  });
  
// 	  // Fetch assigned complaints (not pending but still under SI)
// 	  const assignedComplaints = await Complaint.find({
// 		"flaskData.SI_no": siIdentifier,
// 		"flaskData.ward_number": Number(siWard),
// 		status: "in progress" // Complaints assigned to Muqaddam but not completed
// 	  });
  
// 	  res.json({
// 		pendingComplaints,
// 		assignedComplaints, // New section for SI
// 	  });
// 	} catch (error) {
// 	  console.error("Error fetching SI complaints:", error);
// 	  res.status(500).json({ message: "Error fetching complaints", error: error.message });
// 	}
//   };
  
  exports.getSiForwardedComplaints = async (req, res) => {
	try {
	  const siIdentifier = req.user.identifier;
  
	  const forwardedComplaints = await Complaint.find({
		"flaskData.SI_no": siIdentifier,
		forwardedBySI: true // Only fetch complaints that SI has forwarded
	  }).populate("assignedMuqaddam", "name email"); // Populate Muqaddam details
  
	  const transformedComplaints = forwardedComplaints.map(c => {
		const obj = c.toObject();
		obj.imageUrl = `${req.protocol}://${req.get("host")}${obj.imageUrl}`;
		return obj;
	  });
  
	  res.json({ forwardedComplaints: transformedComplaints });
	} catch (error) {
	  console.error("Error fetching forwarded complaints:", error);
	  res.status(500).json({ message: "Error fetching forwarded complaints", error: error.message });
	}
  };

// SI: Forward a complaint to a Muqaddam
// controllers/complaintController.js
// controllers/complaintController.js
exports.assignMuqaddam = async (req, res) => {
	try {
		const complaintId = req.params.complaintId;
		const { muqaddamId, siInstructions } = req.body;
		if (!muqaddamId) {
			return res.status(400).json({ message: "Muqaddam ID is required" });
		}
		const updatedComplaint = await Complaint.findByIdAndUpdate(
			complaintId,
			{ assignedMuqaddam: muqaddamId, siInstructions, status: "in progress" },
			{ new: true }
		);
		res.json({ message: "Complaint forwarded to Muqaddam", complaint: updatedComplaint });
	} catch (error) {
		console.error("Error assigning Muqaddam:", error);
		res.status(500).json({ message: "Error assigning Muqaddam", error: error.message });
	}
};



// Muqaddam: Get complaints assigned to them
// exports.getMuqaddamComplaints = async (req, res) => {
//   try {
//     // Assume the logged-in Muqaddam's _id is in req.user._id
//     const muqaddamId = req.user._id;
//     const complaints = await Complaint.find({ assignedMuqaddam: muqaddamId, status: "in progress" });
//     res.json({ complaints });
//   } catch (error) {
//     console.error("Error fetching Muqaddam complaints:", error);
//     res.status(500).json({ message: "Error fetching complaints", error: error.message });
//   }
// };
// controllers/complaintController.js
exports.getMuqaddamComplaints = async (req, res) => {
	try {
		const muqaddamId = req.user._id; // Assuming the authenticated muqaddam's _id is available
		const complaints = await Complaint.find({ assignedMuqaddam: muqaddamId, status: "in progress" });
		
		// Transform each complaint's imageUrl into a full URL
		const transformedComplaints = complaints.map(c => {
			const obj = c.toObject();
			obj.imageUrl = `${req.protocol}://${req.get("host")}${obj.imageUrl}`;
			return obj;
		});

		res.json({ complaints: transformedComplaints });
	} catch (error) {
		console.error("Error fetching Muqaddam complaints:", error);
		res.status(500).json({ message: "Error fetching complaints", error: error.message });
	}
};


// Muqaddam: Assign a worker to a complaint
exports.assignWorker = async (req, res) => {
	try {
		const complaintId = req.params.complaintId;
		const { workerId, category } = req.body;
		const complaint = await Complaint.findById(complaintId);
		if (!complaint) return res.status(404).json({ message: "Complaint not found" });
		
		// Append worker assignment details
		complaint.workerAssignments.push({ workerId, category, assignedAt: new Date() });
		await complaint.save();
		
		res.json({ message: "Worker assigned successfully", complaint });
	} catch (error) {
		console.error("Error assigning worker:", error);
		res.status(500).json({ message: "Error assigning worker", error: error.message });
	}
};

// Worker: Mark complaint as completed (upload post-cleaning image)
exports.completeComplaint = async (req, res) => {
	try {
		const complaintId = req.params.complaintId;
		const { postCleaningImage } = req.body;
		
		// Optionally, you could send the image to the Flask API for verification here.
		// For now, update status to "completed" and store the post-cleaning image URL.
		const updatedComplaint = await Complaint.findByIdAndUpdate(
			complaintId,
			{ postCleaningImage, status: "completed" },
			{ new: true }
		);
		res.json({ message: "Complaint marked as completed", complaint: updatedComplaint });
	} catch (error) {
		console.error("Error completing complaint:", error);
		res.status(500).json({ message: "Error completing complaint", error: error.message });
	}
};

