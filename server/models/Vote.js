// models/Vote.js
const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voter",
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
});

module.exports = mongoose.model("Vote", voteSchema);
