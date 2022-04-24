const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const NotesModel = mongoose.model("notes", NotesSchema);

module.exports = NotesModel;
