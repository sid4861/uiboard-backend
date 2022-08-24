const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  s3: String,
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  }
}, { strict: false, timestamps: true });

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;

