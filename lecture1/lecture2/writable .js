const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "input.txt");
const outputPath = path.join(__dirname, "output.txt");

const readStream = fs.createReadStream(inputPath);
const writeStream = fs.createWriteStream(outputPath);

readStream.pipe(writeStream);

writeStream.on("finish", () => {
  console.log("Data successfully written using pipe()");
});
