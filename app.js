const express = require("express");
const app = express();

const students = [
  { id: 1, name: "ANUBHAV", branch: "ECE", address: "Delhi" },
  { id: 2, name: "ASHWANI", branch: "CSE", address: "UP" },
  { id: 3, name: "RAHUL", branch: "ME", address: "Bihar" }
];


app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);   

  const student = students.find(s => s.id === id);

  if (student) {
    res.json(student);
  } else {
    res.json({ message: "Student not found" });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});