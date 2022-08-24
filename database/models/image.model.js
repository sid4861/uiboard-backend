const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  },
  collections: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Collection"
  }],
  tags: [{
    type: String
}]
}, { strict: false, timestamps: true });

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;

