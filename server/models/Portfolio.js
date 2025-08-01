const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  uploaded_file: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Save" }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
