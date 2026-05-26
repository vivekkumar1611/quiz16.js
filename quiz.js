const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Serve frontend
app.use(express.static("public"));

let quiz = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata"],
    answer: "delhi",
  },
  {
    id: 2,
    question: "Which is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Saturn"],
    answer: "jupiter",
  },
  {
    id: 3,
    question: "Who is known as the Father of Computers?",
    options: ["Charles Babbage", "Alan Turing", "Isaac Newton"],
    answer: "charles babbage",
  },
  {
    id: 4,
    question: "What is the national animal of India?",
    options: ["Tiger", "Lion", "Elephant"],
    answer: "tiger",
  },
  {
    id: 5,
    question: "Which gas do humans need to survive?",
    options: ["Carbon Dioxide", "Oxygen", "Nitrogen"],
    answer: "oxygen",
  },
];

let score = 0;

// ✅ Get all questions (without answers)
app.get("/quiz", (req, res) => {
  res.json(quiz.map(({ answer, ...rest }) => rest));
});

// ✅ Submit answer
app.post("/quiz/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userAnswer = req.body.answer?.toLowerCase().trim();

  const question = quiz.find((q) => q.id === id);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  if (!userAnswer) {
    return res.status(400).json({ message: "Answer is required" });
  }

  if (question.answer === userAnswer) {
    score++;
    return res.json({ result: "✅ Correct!", score });
  } else {
    return res.json({
      result: `❌ Wrong! Correct answer: ${question.answer}`,
      score,
    });
  }
});

// ✅ Get score
app.get("/score", (req, res) => {
  res.json({ final_score: score, total: quiz.length });
});

// ✅ Home route fix (important fallback)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server on 3000
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Quiz backend running on port ${PORT}`);
});
