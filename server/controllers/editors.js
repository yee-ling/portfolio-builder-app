const express = require("express");
const router = express.Router();
const Editor = require("../models/Editor");
const isAuth = require("../middleware/auth");
const isPremium = require("../middleware/premium");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/editor");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// CREATE DRAFT
router.post("/", isAuth, async (req, res) => {
  try {
    let editor = new Editor({ ...req.body, user: req.user._id });
    await editor.save();
    return res.json({ msg: "Draft created successfully", editor });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// UPLOAD IMAGE
router.post(
  "/upload-image",
  isAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: "No image uploaded" });
      const imageUrl = `${process.env.API_URL}/editors-files/${req.file.filename}`;
      return res.json({ url: imageUrl });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
);

// GET ALL DRAFTS OF LOGIN USER
router.get("/", isAuth, async (req, res) => {
  try {
    const editors = await Editor.find({ user: req.user._id });
    return res.json(editors);
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot get all saved drafts", error: e.message });
  }
});

// GET A DRAFT BY LOGIN USER
router.get("/draft/:id", isAuth, async (req, res) => {
  try {
    const editor = await Editor.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!editor) {
      return res.status(404).json({ msg: "Draft not found" });
    }
    return res.json(editor);
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot get saved draft", error: e.message });
  }
});

// DELETE DRAFT
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const editor = await Editor.findById(req.params.id);
    if (!editor) {
      return res.status(400).json({ msg: "Draft not found" });
    }
    if (editor.imageUrl) {
      try {
        const fileName = editor.imageUrl.split("/").pop();
        const filePath = path.join(__dirname, "../public/editor/" + fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error("Error deleting image file:", fileError);
      }
    }
    await Editor.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Draft deleted successfully" });
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot delete draft", error: e.message });
  }
});

// UPDATE DRAFT
router.put("/:id", isAuth, upload.single("image"), async (req, res) => {
  try {
    const editor = await Editor.findById(req.params.id);
    if (!editor) {
      return res.status(404).json({ msg: "Draft not found" });
    }

    let updatedData = { ...req.body };
    if (req.file) {
      updatedData.imageUrl = `${process.env.API_URL}/editors-files/${req.file.filename}`;
    }

    if (updatedData.content) {
      updatedData.content = JSON.parse(updatedData.content);
    }

    const updatedEditor = await Editor.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    return res.json({
      msg: "Draft updated successfully",
      editor: updatedEditor,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ msg: "Cannot update draft", error: e.message });
  }
});

module.exports = router;
