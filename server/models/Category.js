const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  tag: { type: String },
  portfolios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }],
});

module.exports = mongoose.model("Category", CategorySchema);
