const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const Category = require("../models/Category");
const isAuth = require("../middleware/auth");
const isPremium = require("../middleware/premium");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ADD PORTFOLIO
router.post("/", isAuth, upload.single("uploaded_file"), async (req, res) => {
  try {
    const { category, ...rest } = req.body;

    let portfolio = new Portfolio({
      ...rest,
      category,
      user: req.user._id,
    });

    if (req.file) portfolio.uploaded_file = req.file.filename;
    await portfolio.save();
    await Category.findByIdAndUpdate(category, {
      $push: { portfolios: portfolio._id },
    });

    return res.json({ msg: "Portfolio created successfully", portfolio });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// GET ALL PORTFOLIOS
//populate later
router.get("/", async (req, res) => {
  try {
    let portfolios = await Portfolio.find()
      .populate("category")
      .populate("user");
    return res.json(portfolios);
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Cannot get all portfolios" });
  }
});

// DELETE PORTFOLIO
router.delete("/:id", isAuth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio || portfolio.user != req.user._id)
      return res.status(403).json({ msg: "You cannot delete this portfolio" });

    if (portfolio.uploaded_file) {
      const fileName = portfolio.uploaded_file;
      const filePath = path.join(__dirname, "../public/" + fileName);
      fs.unlinkSync(filePath);
    }

    if (portfolio.category)
      await Category.findByIdAndUpdate(portfolio.category, {
        $pull: { portfolios: portfolio._id },
      });
    await Portfolio.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Portfolio deleted successfully", portfolio });
  } catch (e) {
    return res.status(400).json({ msg: "Cannot delete portfolio" });
  }
});

// UPDATE PORTFOLIO
router.put("/:id", isAuth, upload.single("uploaded_file"), async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio || portfolio.user != req.user._id) {
      return res.status(403).json({ msg: "You cannot update this portfolio" });
    }

    if (req.file) {
      const fileName = portfolio.uploaded_file;
      const filePath = path.join(__dirname, "../public/" + fileName);
      fs.unlinkSync(filePath);
    }

    let updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        uploaded_file: req.file ? req.file.filename : portfolio.uploaded_file,
        updated_at: Date.now(),
      },
      { new: true }
    );
    return res.json({
      msg: "Portfolio updated successfully",
      portfolio: updatedPortfolio,
    });
  } catch (e) {
    return res.status(400).json({ msg: "Something went wrong" });
  }
});

// GET ALL PORTFOLIOS BY LOGIN USER
//populate later
router.get("/me", isAuth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id })
      .populate("likes")
      .populate("saves")
      .populate("category");
    return res.json(portfolios);
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot get all portfolios", error: e.message });
  }
});

// GET PORTFOLIO BY ID
router.get("/:id", async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id)
      .populate("likes")
      .populate("category")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    return res.json(portfolio);
  } catch (e) {
    return res.status(400).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
