const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON file as database
const file = "students.json";

// Read students
const read = () => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(file));
};

// Write students
const write = data => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// -------------------- ROUTES --------------------

// TEST route
app.get("/", (req, res) => {
  res.send("Student API is running");
});

// GET all students
app.get("/students", (req, res) => {
  res.json(read());
});

// GET student by ID
app.get("/student/:id", (req, res) => {
  const students = read();
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// POST - add new student
app.post("/student", (req, res) => {
  const students = read();

  if (students.some(s => s.id == req.body.id)) {
    return res.status(400).json({ message: "ID already exists" });
  }

  students.push(req.body);
  write(students);

  res.status(201).json(req.body);
});

// PUT - update student
app.put("/student/:id", (req, res) => {
  const students = read();
  const index = students.findIndex(s => s.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  // update only provided fields
  students[index] = { ...students[index], ...req.body };
  write(students);

  res.json(students[index]);
});

// ------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
