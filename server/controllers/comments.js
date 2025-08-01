const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Portfolio = require("../models/Portfolio");
const isAuth = require("../middleware/auth");

// ADD COMMENT
router.post("/:id", isAuth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });

    let comment = new Comment({
      message: req.body.message,
      user: req.user._id,
      portfolio: portfolio._id,
    });
    comment.save();
    portfolio.comments.push(comment._id);
    portfolio.save();
    return res.json({ msg: "Comment successfully added", comment });
  } catch (e) {
    return res.status(400).json({ msg: "Cannot add comment" });
  }
});

// DELETE COMMENT
router.delete("/:id", isAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment || comment.user != req.user._id) {
      return res.status(403).json({ msg: "You cannot delete this comment" });
    } else {
      let portfolio = await Portfolio.findOne({ comments: req.params.id });
      await Portfolio.findByIdAndUpdate(portfolio._id, {
        $pull: { comments: req.params.id },
      });
      await Comment.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Comment deleted successfully", comment });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Cannot delete comment" });
  }
});

// UPDATE A COMMENT
router.put("/:id", isAuth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment || comment.user != req.user._id) {
      return res.status(403).json({ msg: "You cannot update this comment" });
    }
    let updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: Date.now(),
      },
      { new: true }
    );
    return res.json({
      msg: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (e) {
    return res.status(400).json({ msg: "Cannot update comment" });
  }
});

module.exports = router;
