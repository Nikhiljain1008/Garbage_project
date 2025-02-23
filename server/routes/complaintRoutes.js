// const express = require("express");
// const router = express.Router();
// const complaintController = require("../controllers/complaintController");

// // Create a new complaint (Citizen submits complaint)
// router.post("/", complaintController.createComplaint);

// // SI: Get pending complaints for a specific ward (use query parameter, e.g., ?ward=57)
// router.get("/si", complaintController.getSiComplaints);

// // SI: Forward complaint to Muqaddam
// router.post("/:complaintId/assign-muqaddam", complaintController.assignMuqaddam);

// // Muqaddam: Get complaints assigned to them (use query parameter, e.g., ?muqaddamId=<id>)
// router.get("/muqaddam", complaintController.getMuqaddamComplaints);

// // Muqaddam: Assign a worker to a complaint
// router.post("/:complaintId/assign-worker", complaintController.assignWorker);

// // Worker: Mark complaint as completed by uploading verification image
// router.post("/:complaintId/complete", complaintController.completeComplaint);

// module.exports = router;
const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware");

// SI endpoints:
router.get("/si", authMiddleware, complaintController.getSiComplaints);
router.get("/si/forwarded", authMiddleware, complaintController.getSiForwardedComplaints);
router.post("/:complaintId/assign-muqaddam", authMiddleware, complaintController.assignMuqaddam);

// Muqaddam endpoints:
router.get("/muqaddam", authMiddleware, complaintController.getMuqaddamComplaints);
router.post("/:complaintId/assign-worker", authMiddleware, complaintController.assignWorker);

// Worker endpoint:
router.post("/:complaintId/complete", authMiddleware, complaintController.completeComplaint);
router.get("/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, "../uploads", imageName); // Ensure path is correct

    console.log("Requested image:", imagePath); // Debugging log

    // Check if the file exists before sending
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        console.error("Image not found:", imagePath);
        res.status(404).json({ error: "Image not found" });
    }
});

module.exports = router;
