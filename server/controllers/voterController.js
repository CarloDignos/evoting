// controllers/voterController.js
const Voter = require("../models/Voter");

exports.addVoter = async (req, res) => {
  try {
    const { firstName, middleName, lastName, voterId } = req.body;
    const newVoter = new Voter({ firstName, middleName, lastName, voterId });
    await newVoter.save();
    res.status(201).json(newVoter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json(voters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

