const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  url: String,
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  },
  collections: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Collection"
  }],
  mediaType: {
    type: String,
    default:"video"
  },
  tags: [{
    type: String
}]
}, { strict: false, timestamps: true });

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;

