const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  message: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
