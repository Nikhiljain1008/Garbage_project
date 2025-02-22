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
router.post("/:complaintId/assign-muqaddam", authMiddleware, complaintController.assignMuqaddam);

// Muqaddam endpoints:
router.get("/muqaddam", authMiddleware, complaintController.getMuqaddamComplaints);
router.post("/:complaintId/assign-worker", authMiddleware, complaintController.assignWorker);

// Worker endpoint:
router.post("/:complaintId/complete", authMiddleware, complaintController.completeComplaint);

module.exports = router;
