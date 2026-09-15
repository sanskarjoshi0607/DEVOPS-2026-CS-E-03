require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String
  })
);

// Quiz Schema
const Quiz = mongoose.model(
  "Quiz",
  new mongoose.Schema({
    title: String,
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String
      }
    ]
  })
);

// Home Route
app.get("/", (req, res) => {
  res.send("Quiz Portal Backend Running");
});

// Register User
app.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Create Quiz
app.post("/quiz", async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.json(quiz);
});

// Get All Quizzes
app.get("/quiz", async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

// Get Single Quiz
app.get("/quiz/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
});

// Submit Quiz
app.post("/submit/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  let score = 0;

  quiz.questions.forEach((q, index) => {
    if (req.body.answers[index] === q.correctAnswer) {
      score++;
    }
  });

  res.json({
    totalQuestions: quiz.questions.length,
    score: score
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});