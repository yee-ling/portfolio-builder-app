const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isAuth = require("../middleware/auth");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

require("dotenv").config();
const { SECRET_KEY } = process.env;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let userFound = await User.findOne({ email, username });
    if (userFound) return res.status(400).json({ msg: "User already exists" });

    let salt = bcrypt.genSaltSync(12);
    let hashedPassword = bcrypt.hashSync(password, salt);
    let user = new User({ ...req.body, password: hashedPassword });
    user.save();
    return res.json({ msg: "Registered successfully", user });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    let user = await User.findOne({ email, username });
    if (!user) return res.status(400).json({ msg: "User doesn't exist" });

    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    let token = jwt.sign({ data: user }, SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ user, msg: "Login successful" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/me", isAuth, (req, res) => {
  return res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ msg: "Logged Out" });
});

router.put("/premium/:id", isAuth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user || user._id != req.user._id) {
      return res.status(403).json({ msg: "You cannot update user role" });
    }

    const upgradedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isPremium: true },
      },
      {
        new: true,
      }
    );
    return res.json({ msg: "User role updated", user: upgradedUser });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Cannot update user role" });
  }
});

module.exports = router;
