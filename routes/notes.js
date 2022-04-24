const express = require("express");
const Note = require("../models/Notes");
const fetchusers = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const router = express.Router();

//Route 1: Fetch All Notes : GET "/api/notes/fetchallnotes"

router.get("/fetchallnotes", fetchusers, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});
//Route 2: Add Notes : POST "/api/notes/addnote"

router.post(
  "/addnote",
  fetchusers,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // validation errors
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

//Route 3: Update Notes : PUT "/api/notes/updatenote"

router.put("/updatenote/:id", fetchusers, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // create new note obj
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

//Route 4: Delete Notes : DEL "/api/notes/deletenotes"
router.delete("/deletenotes/:id", fetchusers, async (req, res) => {
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // find the note to be updated and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found");
    }
    // allow deletion only if user owns
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note Delete" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
