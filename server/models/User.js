const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  avatar: { type: String },
  banner: { type: String },
  isPremium: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  savedPortfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Save" }],
});

module.exports = mongoose.model("User", UserSchema);
