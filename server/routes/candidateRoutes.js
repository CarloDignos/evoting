// routes/candidateRoutes.js
const express = require("express");
const candidateController = require("../controllers/candidateController");
const router = express.Router();

router.get("/", candidateController.getAllCandidates);
router.post("/", candidateController.addCandidate);

module.exports = router;
