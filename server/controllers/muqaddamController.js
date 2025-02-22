const GovEmployee = require("../models/GovEmployee");

// Get all pending workers under a specific Muqaddam
const getPendingWorkers = async (req, res) => {
    try {
        const { muqaddamKey } = req.params; // Get Muqaddam key from URL

        const pendingWorkers = await GovEmployee.find({ 
            role: "worker", 
            muqaddamKey: muqaddamKey, 
            status: "pending" 
        });

        res.status(200).json(pendingWorkers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getPendingWorkers };
