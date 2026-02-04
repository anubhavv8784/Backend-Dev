const express = require("express");
const app = express();

/* =========================
   MIDDLEWARE
========================= */
// must be before routes
app.use(express.json());

/* =========================
   DATA
========================= */
let students = [
  { id: 1, name: "ANUBHAV", branch: "ECE", address: "Delhi" },
  { id: 2, name: "ASHWANI", branch: "CSE", address: "UP" }
];

/* =========================
   ROUTES
========================= */

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Student API 🚀");
});

// GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET student by ID (PARAM)
app.get("/student/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// GET students by branch (QUERY)
app.get("/search/student", (req, res) => {
  const branch = req.query.branch;

  if (!branch) {
    return res.status(400).json({ message: "Please provide branch query" });
  }

  const result = students.filter(
    s => s.branch.toLowerCase() === branch.toLowerCase()
  );

  if (result.length === 0) {
    return res.json({ message: "No students found for this branch" });
  }

  res.json(result);
});

// POST add new student
app.post("/student", (req, res) => {
  // safe destructuring
  const { id, name, branch, address } = req.body || {};

  // validation
  if (!id || !name || !branch || !address) {
    return res.status(400).json({
      message: "id, name, branch and address are required"
    });
  }

  // check duplicate id
  const exists = students.find(s => s.id === id);
  if (exists) {
    return res.status(409).json({ message: "Student ID already exists" });
  }

  // add student
  students.push({ id, name, branch, address });

  res.status(201).json({
    message: "Student added successfully",
    students
  });
});

/* =========================
   SERVER
========================= */
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});