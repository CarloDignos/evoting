// models/Candidate.js
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  position: {
    type: String, // 'PunongBarangay' or 'Kagawad'
    required: true,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
