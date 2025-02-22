// // controllers/govEmployeeController.js
// const GovEmployee = require("../models/GovEmployee");
// const bcrypt = require("bcrypt");
// const { ALLOWED_GOV_EMAILS } = require("../config");

// exports.registerGovEmployee = async (req, res) => {
// 	try {
// 		const { name, email, password, role, ward, identifier } = req.body;
// 		if (!password || typeof password !== "string") {
// 			return res.status(400).json({ message: "Invalid password format" });
// 		}
// 		// For government employees (non-citizens), verify email is allowed and identifier is provided.
// 		if (role && role.toLowerCase() !== "citizen") {
// 			if (!ALLOWED_GOV_EMAILS.includes(email)) {
// 				return res.status(401).json({ message: "Email is not authorized for government registration" });
// 			}
// 			if (!identifier) {
// 				return res.status(400).json({ message: "Identifier is required" });
// 			}
// 		}
// 		const salt = await bcrypt.genSalt(10);
// 		const hashedPassword = await bcrypt.hash(password, salt);
// 		const newGovEmployee = new GovEmployee({
// 			name,
// 			email,
// 			password: hashedPassword,
// 			role,
// 			ward,
// 			identifier,
// 		});
// 		const savedEmployee = await newGovEmployee.save();
// 		res.status(201).json({
// 			message: "Government employee registered successfully",
// 			employee: savedEmployee,
// 		});
// 	} catch (error) {
// 		console.error("Error registering government employee:", error);
// 		res.status(500).json({ message: "Error registering government employee", error: error.message });
// 	}
// };

// exports.getMuqaddams = async (req, res) => {
//   try {
//     // Query GovEmployee collection for documents with role "muqaddam"
//     const muqaddams = await GovEmployee.find({ role: "muqaadam" });
//     res.status(200).json({ muqaddams });
//   } catch (error) {
//     console.error("Error fetching muqaddams:", error);
//     res.status(500).json({ message: "Error fetching muqaddams", error: error.message });
//   }
// };

// controllers/govEmployeeController.js
const GovEmployee = require("../models/GovEmployee");
const bcrypt = require("bcrypt");
const { ALLOWED_GOV_EMAILS } = require("../config");

// Generate a unique 6-letter Muqaddam Key
const generateMuqaddamKey = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.registerGovEmployee = async (req, res) => {
	try {
	  const { name, email, password, role, ward, identifier, muqaddamKey, category } = req.body;
  
	  // Validate category: Only required for "worker" role
	  let categoryValue = undefined;
	  if (role === "worker") {
		if (!category || !["Street Sweepers", "Garbage Collectors"].includes(category)) {
		  return res.status(400).json({ message: "Invalid or missing category for worker." });
		}
		categoryValue = category; // Assign category only for workers
	  }
  
	  // Ensure category is not included for non-worker roles
	  if (role !== "worker") {
		categoryValue = undefined; // Remove category for other roles
	  }
  
	  // Check if email already exists
	  const existingEmployee = await GovEmployee.findOne({ email });
	  if (existingEmployee) {
		return res.status(400).json({ message: "Email already registered." });
	  }
  
	  // Hash password
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  // Generate Muqaddam Key if the role is "muqaadam"
	  let generatedMuqaddamKey = null;
	  if (role === "muqaadam") {
		generatedMuqaddamKey = generateMuqaddamKey();
	  }
  
	  // Create new government employee
	  const newEmployee = new GovEmployee({
		name,
		email,
		password: hashedPassword,
		role,
		ward,
		identifier,
		muqaddamKey: role === "muqaadam" ? generatedMuqaddamKey : muqaddamKey || undefined, // Ensure undefined if not applicable
		category: categoryValue, // Ensures no validation error
		status: role === "worker" ? "pending" : "approved",
	  });
  
	  await newEmployee.save();
	  res.status(201).json({ message: "Registration successful.", muqaddamKey: generatedMuqaddamKey });
  
	} catch (error) {
	  console.error("Error registering government employee:", error);
	  res.status(500).json({ message: "Internal server error." });
	}
  };
  
  
// Get list of Muqaddams
exports.getMuqaddams = async (req, res) => {
  try {
    const muqaddams = await GovEmployee.find({ role: "muqaadam" });
    res.status(200).json({ muqaddams });
  } catch (error) {
    console.error("Error fetching muqaddams:", error);
    res.status(500).json({ message: "Error fetching muqaddams", error: error.message });
  }
};

// Muqaddam approves a worker's registration
exports.approveWorker = async (req, res) => {
  try {
    const { workerId } = req.body;
    const worker = await GovEmployee.findById(workerId);

    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.status = "approved"; // Approve worker
    await worker.save();

    res.status(200).json({ message: "Worker approved successfully" });

  } catch (error) {
    console.error("Error approving worker:", error);
    res.status(500).json({ message: "Error approving worker", error: error.message });
  }
};

// Get only approved workers for a Muqaddam's dropdown
exports.getVerifiedWorkers = async (req, res) => {
  try {
    const { muqaddamKey, category } = req.query;

    if (!muqaddamKey) {
      return res.status(400).json({ message: "Muqaddam Key is required" });
    }

    // Fetch only approved workers under this Muqaddam
    const workers = await GovEmployee.find({
      role: "worker",
      muqaddamKey,
      category,
      status: "approved"
    });

    res.status(200).json({ workers });

  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Error fetching workers", error: error.message });
  }
};
