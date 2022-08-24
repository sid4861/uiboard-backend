const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema({
  email:String,
}, { strict: false });

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

module.exports = Waitlist;

