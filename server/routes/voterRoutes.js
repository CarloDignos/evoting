// routes/voterRoutes.js
const express = require("express");
const voterController = require("../controllers/voterController");
const router = express.Router();

router.post("/", voterController.addVoter);
router.get("/", voterController.getAllVoters);

module.exports = router;
