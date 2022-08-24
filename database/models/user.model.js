const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
        required: 'Email is required',
        trim: true,
        lowercase: true,
        unique: true,
  },
  password:  {
        type: String,
        required: 'Password is required',
        min: 8,
        max: 32
    },
}, { strict: false, timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

