// // const jwt = require("jsonwebtoken");

// // module.exports = (req, res, next) => {
// //     const token = req.header("Authorization");

// //     if (!token) {
// //         return res.status(401).json({ message: "Unauthorized: No token provided" });
// //     }

// //     try {
// //         const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
// //         req.user = decoded;
// //         next();
// //     } catch (error) {
// //         return res.status(401).json({ message: "Invalid token" });
// //     }
// // };

// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1]; // Extract token
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = { userId: decoded.userId, role: decoded.role }; // Attach user info to request
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }A
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    console.log("🔒 Auth Middleware Triggered");

    // Extract token from headers
    const token = req.header("Authorization");
    if (!token) {
        console.log("🚨 No token found in headers");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        // Find the user in the database
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log("🚨 No user found with ID:", decoded.userId);
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request
        console.log("✅ User Authenticated:", user.email);
        next();
    } catch (error) {
        console.error("❌ Error verifying token:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
