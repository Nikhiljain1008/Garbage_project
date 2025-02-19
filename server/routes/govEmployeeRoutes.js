const express = require("express");
const router = express.Router();
const govEmployeeController = require("../controllers/govEmployeeController");

// Registration endpoint for government employees
// Note: We're using "/register2" here so it doesn't conflict with citizen registration.
router.post("/register2", govEmployeeController.register2);

module.exports = router;
