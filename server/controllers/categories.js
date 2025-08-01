const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const isAuth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

// ADD CATEGORY
router.post("/", isAuth, isAdmin, (req, res) => {
  try {
    const category = new Category(req.body);
    category.save();
    return res.json({ msg: "Category added successfully", category });
  } catch (e) {
    return res.status(400).json({ msg: "Failed to add Category" });
  }
});

// GET ALL CATEGORY
//populate later
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot get all categories", error: e.message });
  }
});

// DELETE CATEGORY
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    } else {
      await Category.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Category deleted successfully", category });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Cannot delete category" });
  }
});

// UPDATE CATEGORY
router.put("/:id", isAuth, isAuth, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    } else {
      let updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      return res.json({
        msg: "Category updated successfully",
        category: updatedCategory,
      });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Unable to update category" });
  }
});

// GET CATEGORY BY ID
//populate later
router.get("/:id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    return res.json(category);
  } catch (e) {
    return res.status(400).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
