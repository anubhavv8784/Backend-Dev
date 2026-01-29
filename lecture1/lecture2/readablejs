const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "input.txt");
const outputPath = path.join(__dirname, "output.txt");

const readStream = fs.createReadStream(inputPath, {
  encoding: "utf-8"
});
const writeStream = fs.createWriteStream(outputPath);

readStream.pipe(writeStream);

readStream.on("end", () => {
  console.log("Data copied to output.txt successfully");
});

readStream.on("error", (err) => {
  console.error("Read error:", err);
});
