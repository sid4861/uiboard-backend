const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  }
}, { strict: false, timestamps: true });

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;

