// Import required modules
const express = require("express");
const fs = require("fs").promises;

const app = express();
app.use(express.json());

// Server port
const PORT = 8000;

// JSON file used as database
const FILE_PATH = "./students.json";

/* =========================
   CUSTOM MIDDLEWARE
========================= */

// 1. Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} request came on ${req.url}`);
  next();
});

// 2. Time Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3. Validation Middleware (for POST & PUT)
const validateStudent = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Empty body not allowed" });
  }
  next();
};

/* =========================
   HELPER FUNCTIONS
========================= */

const readStudents = async () => {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
};

const writeStudents = async (data) => {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
};

/* =========================
   ROUTES
========================= */

// GET all students
app.get("/students", async (req, res) => {
  const students = await readStudents();
  res.status(200).json({
    time: req.requestTime,
    students
  });
});

// GET student by ID
app.get("/students/:id", async (req, res) => {
  const students = await readStudents();
  const student = students.find(s => s.id === parseInt(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json({
    time: req.requestTime,
    student
  });
});

// POST - create new student
app.post("/students", validateStudent, async (req, res) => {
  const students = await readStudents();

  students.push(req.body);
  await writeStudents(students);

  res.status(201).json({
    message: "Student created successfully",
    student: req.body
  });
});

// PUT - update student
app.put("/students/:id", validateStudent, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const students = await readStudents();
    const index = students.findIndex(s => s.id === userId);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    students[index] = {
      ...students[index],
      ...req.body
    };

    await writeStudents(students);

    res.status(200).json({
      message: "Updated successfully",
      student: students[index]
    });
  } catch (err) {
    next(err);
  }
});

// DELETE - remove student
app.delete("/students/:id", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const students = await readStudents();
    const index = students.findIndex(s => s.id === userId);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    const deletedStudent = students.splice(index, 1);
    await writeStudents(students);

    res.status(200).json({
      message: "Student deleted successfully",
      deletedStudent: deletedStudent[0]
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   ERROR HANDLING MIDDLEWARE
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});