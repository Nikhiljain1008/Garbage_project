// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");

// dotenv.config();
// connectDB(); // Connect to MongoDB

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes"); // Import image routes
const path = require("path");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors());

// Auth Routes
app.use("/api/auth", authRoutes);

// ✅ Image Upload Routes (Now Handled Separately)
app.use("/api/images", imageRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
