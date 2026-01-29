const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }

  // remove extra spaces and split into words
  const words = data.trim().split(/\s+/);
  const wordCount = data.trim() === "" ? 0 : words.length;

  const outputText = `Total Words: ${wordCount}\n`;

  fs.writeFile("output.txt", outputText, (err) => {
    if (err) {
      console.log("Error writing file:", err);
      return;
    }
    console.log
  });
});
