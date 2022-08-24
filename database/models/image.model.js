const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  s3: String,
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
  }
}, { strict: false, timestamps: true });

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;

