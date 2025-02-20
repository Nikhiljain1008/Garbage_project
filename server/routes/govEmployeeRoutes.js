// routes/govEmployeeRoutes.js
const express = require("express");
const router = express.Router();
const govEmployeeController = require("../controllers/govEmployeeController");

router.post("/register2", govEmployeeController.registerGovEmployee);

router.get("/muqaddams", govEmployeeController.getMuqaddams);

module.exports = router;
