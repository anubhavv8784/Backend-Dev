const fs = require("fs");
const readline = require("readline");

// Counters
let totalLines = 0;
let infoCount = 0;
let errorCount = 0;
let warningCount = 0;

// Create read stream
const fileStream = fs.createReadStream("app.log");

// Create readline interface (stream-based)
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

// Read file line by line
rl.on("line", (line) => {
  totalLines++;

  if (line.includes("ERROR")) {
    errorCount++;
  } else if (line.includes("WARNING")) {
    warningCount++;
  } else if (line.includes("INFO")) {
    infoCount++;
  }
});

// When file reading is complete
rl.on("close", () => {
  console.log("\n📊 Log File Summary Report");
  console.log("---------------------------");
  console.log("Total log entries:", totalLines);
  console.log("INFO count:", infoCount);
  console.log("WARNING count:", warningCount);
  console.log("ERROR count:", errorCount);
});
