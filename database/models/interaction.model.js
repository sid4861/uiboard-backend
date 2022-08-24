const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  url: String,
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  },
  tags: [{
    type: String
}]
}, { strict: false, timestamps: true });

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;

