const express = require("express");
const router = express.Router();
const Save = require("../models/Save");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const isAuth = require("../middleware/auth");

// SAVE/UNSAVE
router.put("/:id", isAuth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(400).json({ msg: "Portfolio not found" });

    let existingSave = await Save.findOne({
      user: req.user._id,
      portfolio: portfolio._id,
    });

    if (existingSave) {
      await Portfolio.findByIdAndUpdate(portfolio._id, {
        $pull: { saves: existingSave._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedPortfolio: existingSave._id },
      });
      await Save.findByIdAndDelete(existingSave._id);
      return res.json({ msg: "Unsaved a portfolio" });
    } else {
      let save = new Save({
        user: req.user._id,
        portfolio: portfolio._id,
        saved_at: new Date(),
      });
      await save.save();

      await Portfolio.findByIdAndUpdate(portfolio._id, {
        $push: { saves: save._id },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: { savedPortfolio: save._id },
      });

      return res.json({ msg: "Saved a portfolio" });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Cannot save this portfolio" });
  }
});

// GET ALL SAVEDPORTFOLIO BY LOGIN USER
router.get("/me", isAuth, async (req, res) => {
  try {
    const saves = await Save.find({ user: req.user._id }).populate("portfolio");
    const savedPortfolios = saves
      .map((save) => save.portfolio)
      .filter((portfolio) => portfolio?._id);
    return res.json(savedPortfolios);
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot get all saved portfolios", error: e.message });
  }
});

module.exports = router;
