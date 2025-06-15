// models/Voter.js
const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false, // optional
  },
  lastName: {
    type: String,
    required: true,
  },
  voterId: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Voter", voterSchema);