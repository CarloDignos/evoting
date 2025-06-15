// routes/blockchainRoutes.js
const express = require("express");
const { getBlockchain, validateBlockchain } = require("../controllers/blockchainController");
const router = express.Router();

router.get("/blockchain", getBlockchain);
router.get("/validate", validateBlockchain);

module.exports = router;
