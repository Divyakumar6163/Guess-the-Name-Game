const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(morgan("dev"));
// Schema
const objectSchema = new mongoose.Schema({
  object: {
    type: String,
    required: [true, "Please add an object name/title"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  category: {
    type: String,
    required: [true, "Please add the category of the object"],
  },
  description: {
    type: String,
    required: [true, "Please add a description about the object"],
  },
});

const ObjectModel = mongoose.model("Object", objectSchema);

const objectSchemaImg = new mongoose.Schema({
  object: {
    type: String,
    required: [true, "Please add an object name/title"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  image: {
    type: String,
    required: [true, "Please add the Base64 image data"],
  },
});
const ObjectModelImg = mongoose.model("ObjectImg", objectSchemaImg);

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please add a question"],
  },
  options: {
    type: [String],
    required: [true, "Please add options"],
  },
  answer: {
    type: String,
    required: [true, "Please add the correct answer"],
  },
});
const quizSchema = new mongoose.Schema({
  quiz: {
    type: [questionSchema],
    required: true,
  },
});
const QuizModel = mongoose.model("quiz", quizSchema);

// POST route for creating an object with Base64 image
app.post("/guess-the-object/player1", async (req, res) => {
  const { object, image, category, description } = req.body;
  try {
    if (image) {
      const newObjectImg = new ObjectModelImg({
        object,
        image,
      });
      await newObjectImg.save();
      console.log(newObjectImg);
      res.status(201).json({ message: "Data with image saved successfully" });
    } else {
      const newObject = new ObjectModel({
        object,
        category,
        description,
      });
      await newObject.save();
      console.log(newObject);
      res.status(201).json({ message: "Data saved successfully" });
    }
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/guess-the-object/player2", async (req, res) => {
  try {
    let objects;
    if (req.query.keyword === "image") {
      objects = await ObjectModelImg.find();
    } else {
      objects = await ObjectModel.find();
    }
    res.status(200).json(objects);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/quiz/createQuiz", async (req, res) => {
  try {
    const { quiz } = req.body;
    console.log(quiz);
    const newQuiz = new QuizModel({
      quiz,
    });
    await newQuiz.save();
    // console.log(newQuiz);
    res.status(201).json({ message: "Data saved successfully" });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/quiz/playQuiz", async (req, res) => {
  try {
    let data;
    data = await QuizModel.find();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = app;
