const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GovEmployee = require('../models/GovEmployee');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    let user;
    // Use the 'role' in the token to decide which collection to query.
    if (decoded.role === 'user' || decoded.role === 'citizen') {
      user = await User.findById(decoded.id);
    } else {
      user = await GovEmployee.findById(decoded.id);
    }
    if (!user) {
      return res.status(404).json({ message: "No user found with ID: " + decoded.id });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};