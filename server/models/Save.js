const mongoose = require("mongoose");

const SaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
  saved_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Save", SaveSchema);
