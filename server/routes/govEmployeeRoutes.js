const express = require("express");
const router = express.Router();
const govEmployeeController = require("../controllers/govEmployeeController");

router.post("/register2", govEmployeeController.registerGovEmployee);
router.get("/muqaddams", govEmployeeController.getMuqaddams);
router.post("/approve-worker", govEmployeeController.approveWorker);
router.get("/verified-workers", govEmployeeController.getVerifiedWorkers);

module.exports = router;

