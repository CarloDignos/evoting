// controllers/candidateController.js
const Candidate = require("../models/Candidate");

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCandidate = async (req, res) => {
  try {
    const { firstName, middleName, lastName, position } = req.body;
    const newCandidate = new Candidate({ firstName, middleName, lastName, position });
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};