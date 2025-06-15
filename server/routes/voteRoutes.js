// routes/voteRoutes.js
const express = require("express");
const voteController = require("../controllers/voteController");
const router = express.Router();

router.post("/", voteController.castVote);
router.get("/chain", voteController.getBlockchain);
router.get("/validate", voteController.validateBlockchain);

module.exports = router;
