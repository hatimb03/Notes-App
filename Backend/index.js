require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils");
const PORT = process.env.PORT || 3000;

const app = express();
const userModel = require("./Models/userModel");
const noteModel = require("./Models/noteModel");

// Connect to MongoDB
mongoose
  .connect(process.env.connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ Data: "hello" });
});

// Create an account
app.post("/create-account", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const user = await userModel.create({ name, email, password });

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3680m" }
  );

  return res.json({
    error: false,
    user: { name: user.name, email: user.email },
    accessToken,
    message: "Registration Successful",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and password are required" });
  }

  const user = await userModel.findOne({ email });
  if (!user || user.password !== password) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "36000m" }
  );

  return res.json({
    error: false,
    message: "Login Successful",
    email,
    accessToken,
  });
});

//Get user
app.get("/get-user", authenticateToken, async (req, res) => {
  let user = req.user;

  const isUser = await userModel.findOne({ _id: user.userId });

  if (!isUser) return res.sendStatus(401);

  return res.json({
    user: {
      name: isUser.name,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

// Add a note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = await noteModel.create({
      title,
      content,
      tags: tags || [],
      userId: user.userId, // Make sure this matches the field name in your schema
    });

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Edit a note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await noteModel.findOne({ _id: noteId, userId: user.userId });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Getting all the notes for dashboard
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    let user = req.user;
    let notes = await noteModel
      .find({ userId: user.userId })
      .sort({ isPinned: -1 });

    if (notes.length === 0) {
      return res.json({
        message: "No notes found for the user",
      });
    }

    return res.status(200).json({
      error: false,
      notes,
      message: "Notes stored successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//Deleting a note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    let user = req.user;
    let noteId = req.params.noteId;

    const note = await noteModel.findOne({ _id: noteId, userId: user.userId });
    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    await noteModel.deleteOne({ _id: noteId, userId: user.userId });

    return res.status(200).json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//Updating note isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  let user = req.user;

  let noteId = req.params.noteId;
  let { isPinned } = req.body;

  try {
    const note = await noteModel.findOne({ _id: noteId, userId: user.userId });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    note.isPinned = isPinned || false;
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Search
app.get("/search-notes", authenticateToken, async (req, res) => {
  const user = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await noteModel.find({
      userId: user.userId,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.status(200).json({
      error: false,
      notes: matchingNotes,
      message: "Notes found successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.listen(PORT);

module.exports = app;
