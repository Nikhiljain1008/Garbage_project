// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true, required: true },
//     password: String,
//     role: String,
//     images: [
//         {
//             imageUrl: String,
//             location: String,
//             description: String,
//             garbageProbability: String,
//             cleanStreetProbability: String,
//             createdAt: { type: Date, default: Date.now }
//         }
//     ]
// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    images: [
        {
            imageUrl: String,
            location: String,
            description: String,
            garbageProbability: Number,
            cleanStreetProbability: Number,
            uploadedAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
