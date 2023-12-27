const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String },
  userid: { type: String, minLength: 6, maxLength: 64 },
  user_pass: { type: String, minLength: 6, maxLength: 1024 },
});

module.exports = mongoose.model("User", userSchema);
