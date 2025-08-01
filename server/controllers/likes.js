const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Portfolio = require("../models/Portfolio");
const isAuth = require("../middleware/auth");

router.put("/:id", isAuth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(400).json({ msg: "Portfolio not found" });

    let existingLike = await Like.findOne({
      user: req.user._id,
      portfolio: portfolio._id,
    });

    if (existingLike) {
      await Portfolio.findByIdAndUpdate(portfolio._id, {
        $pull: { likes: existingLike._id },
      });
      await Like.findByIdAndDelete(existingLike._id);
      return res.json({ msg: "Unliked a portfolio" });
    } else {
      let like = new Like({ user: req.user._id, portfolio: portfolio._id });
      await like.save();
      portfolio.likes.push(like._id);
      await portfolio.save();
      return res.json({ msg: "Liked a portfolio" });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Cannot like this portfolio" });
  }
});

// GET LIKED PORTFOLIOS BY LOGIN USER
router.get("/me", isAuth, async (req, res) => {
  try {
    const likes = await Like.find({ user: req.user._id }).populate("portfolio");
    const likedPortfolios = likes
      .map((like) => like.portfolio)
      .filter((portfolio) => portfolio?._id);
    return res.json(likedPortfolios);
  } catch (e) {
    return res.status(400).json({ msg: "Cannot get all liked portfolio" });
  }
});

module.exports = router;
