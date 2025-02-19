const GovEmployee = require("../models/GovEmployee");
const bcrypt = require("bcrypt");
const { ALLOWED_GOV_EMAILS } = require("../config");

exports.register2 = async (req, res) => {
  const { name, email, password, role, ward } = req.body;

  // For government employees (non-citizens), verify that the email is authorized.
  if (role && role.toLowerCase() !== "citizen") {
    if (!ALLOWED_GOV_EMAILS.includes(email)) {
      return res.status(401).json({ message: "Email is not authorized for government registration" });
    }
  }

  try {
    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new government employee document
    const newGovEmployee = new GovEmployee({
      name,
      email,
      password: hashedPassword,
      role,
      ward, // optional, for roles that require ward info (e.g., SI, Muqaddam)
    });

    const savedEmployee = await newGovEmployee.save();
    res.status(201).json({
      message: "Government employee registered successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    console.error("Error registering government employee:", error);
    res.status(500).json({ message: "Error registering government employee", error });
  }
};
