const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
  email:String,
}, { strict: false });

const Whitelist = mongoose.model("Whitelist", whitelistSchema);

module.exports = Whitelist;

