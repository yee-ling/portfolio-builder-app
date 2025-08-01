const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
  liked_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Like", LikeSchema);
