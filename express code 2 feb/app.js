const express = require("express");
const app = express();

// students data
const students = [
  { id: 1, name: "ANUBHAV", branch: "ECE", address: "Delhi" },
  { id: 2, name: "ASHWANI", branch: "CSE", address: "UP" },
  { id: 3, name: "RAHUL", branch: "CSE", address: "Bihar" },
  { id: 4, name: "ROHIT", branch: "ME", address: "MP" }
];

// home route
app.get("/", (req, res) => {
  res.send("Welcome to Student API 🚀");
});

// get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// get student by id (PARAM)
app.get("/student/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(s => s.id === id);

  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

// search students by branch (QUERY)
app.get("/search/student", (req, res) => {
  const branch = req.query.branch;

  if (!branch) {
    return res.json({ message: "Please provide branch query" });
  }

  const result = students.filter(
    s => s.branch.toLowerCase() === branch.toLowerCase()
  );

  if (result.length > 0) {
    res.json(result);
  } else {
    res.json({ message: "No students found for this branch" });
  }
});

// server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});