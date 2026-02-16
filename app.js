const express = require("express");
const fs = require("fs");
const app = express();

console.log("App starting...");

try {
  const students = JSON.parse(
    fs.readFileSync("./students.json", "utf-8")
  );

  console.log("Students file loaded successfully");

  app.get("/students", (req, res) => {
    res.json(students);
  });

} catch (error) {
  console.log("Error reading students.json:", error.message);
}

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
