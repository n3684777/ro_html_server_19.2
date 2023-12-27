const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, maxLength: 20, required: true },
  content: { type: String, required: true },
  author: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
