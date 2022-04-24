const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
// Route files
const authRoute = require("./routes/auth.js");
const notesRoute = require("./routes/notes.js");

connectToMongo();

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/notes", notesRoute);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
