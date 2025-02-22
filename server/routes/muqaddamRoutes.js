const express = require("express");
const router = express.Router();
const { getPendingWorkers } = require("../controllers/muqaddamController");
const GovEmployee = require("../models/GovEmployee");  // 👈 FIXED: Import the model

// ✅ Route to get pending workers for a specific Muqaddam
router.get("/pending-workers/:muqaddamKey", getPendingWorkers);

// ✅ Approve Worker API
router.put("/approve-worker/:workerId", async (req, res) => {
    try {
        const workerId = req.params.workerId;
        const worker = await GovEmployee.findByIdAndUpdate(workerId, { status: "approved" }, { new: true });

        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.json({ message: "Worker approved successfully", worker });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Reject Worker API
router.delete("/reject-worker/:workerId", async (req, res) => {
    try {
        const workerId = req.params.workerId;
        const worker = await GovEmployee.findByIdAndDelete(workerId);

        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.json({ message: "Worker rejected and deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
