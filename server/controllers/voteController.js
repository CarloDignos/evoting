
//voteController.js
const { Block, Blockchain } = require("../blockchain");
const Vote = require("../models/Vote");
const Voter = require("../models/Voter");
const Candidate = require("../models/Candidate");

const electionChain = new Blockchain();

exports.castVote = async (req, res) => {
  const { voterId, punongBarangayId, kagawadIds } = req.body;

  try {
    // Find the voter by voterId
    const voter = await Voter.findOne({ voterId });
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    // Validate Punong Barangay vote
    const punongBarangay = await Candidate.findById(punongBarangayId);
    if (!punongBarangay || punongBarangay.position !== "PunongBarangay") {
      return res.status(400).json({ message: "Invalid Punong Barangay candidate" });
    }

    // Validate Kagawad votes
    if (kagawadIds.length > 7) {
      return res.status(400).json({ message: "You can only vote for up to 7 Kagawad" });
    }

    const kagawadVotes = await Candidate.find({ _id: { $in: kagawadIds }, position: "Kagawad" });
    if (kagawadVotes.length !== kagawadIds.length) {
      return res.status(400).json({ message: "Invalid Kagawad candidates" });
    }

    // Ensure the voter hasn't voted already
    const existingVote = await Vote.findOne({ voter: voter._id });
    if (existingVote) {
      return res.status(400).json({ message: "Voter has already voted" });
    }

    // Create new blockchain block for each vote
    const voteData = {
      voterId: voterId,
      punongBarangayId: punongBarangayId,
      kagawadIds: kagawadIds,
    };
    const newBlock = new Block(electionChain.chain.length, Date.now(), voteData);
    electionChain.addBlock(newBlock);

    // Save the votes (Punong Barangay and Kagawad)
    const punongBarangayVote = new Vote({ voter: voter._id, candidate: punongBarangay._id });
    await punongBarangayVote.save();

    for (let kagawad of kagawadVotes) {
      const kagawadVote = new Vote({ voter: voter._id, candidate: kagawad._id });
      await kagawadVote.save();
    }

    res.json({ message: "Vote cast successfully!", chain: electionChain.chain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBlockchain = (req, res) => {
  res.json(electionChain.chain);
};

exports.validateBlockchain = (req, res) => {
  const isValid = electionChain.isChainValid();
  res.json({ isValid });
};
