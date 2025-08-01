const mongoose = require("mongoose");

const EditorSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  content: { type: Object },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublished: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Editor", EditorSchema);
