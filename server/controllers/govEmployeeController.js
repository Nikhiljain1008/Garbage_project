// controllers/govEmployeeController.js
const GovEmployee = require("../models/GovEmployee");
const bcrypt = require("bcrypt");
const { ALLOWED_GOV_EMAILS } = require("../config");

exports.registerGovEmployee = async (req, res) => {
	try {
		const { name, email, password, role, ward, identifier } = req.body;
		if (!password || typeof password !== "string") {
			return res.status(400).json({ message: "Invalid password format" });
		}
		// For government employees (non-citizens), verify email is allowed and identifier is provided.
		if (role && role.toLowerCase() !== "citizen") {
			if (!ALLOWED_GOV_EMAILS.includes(email)) {
				return res.status(401).json({ message: "Email is not authorized for government registration" });
			}
			if (!identifier) {
				return res.status(400).json({ message: "Identifier is required" });
			}
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newGovEmployee = new GovEmployee({
			name,
			email,
			password: hashedPassword,
			role,
			ward,
			identifier,
		});
		const savedEmployee = await newGovEmployee.save();
		res.status(201).json({
			message: "Government employee registered successfully",
			employee: savedEmployee,
		});
	} catch (error) {
		console.error("Error registering government employee:", error);
		res.status(500).json({ message: "Error registering government employee", error: error.message });
	}
};

exports.getMuqaddams = async (req, res) => {
  try {
    // Query GovEmployee collection for documents with role "muqaddam"
    const muqaddams = await GovEmployee.find({ role: "muqaadam" });
    res.status(200).json({ muqaddams });
  } catch (error) {
    console.error("Error fetching muqaddams:", error);
    res.status(500).json({ message: "Error fetching muqaddams", error: error.message });
  }
};
