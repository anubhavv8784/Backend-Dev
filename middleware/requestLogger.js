const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "..", "logs");
const logFile = path.join(logDirectory, "requests.log");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    const logLine = [
      `[${new Date().toISOString()}]`,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${responseTime}ms`
    ].join(" ");

    fs.appendFile(logFile, `${logLine}\n`, (error) => {
      if (error) {
        console.error("Request log write failed:", error.message);
      }
    });
  });

  next();
}

module.exports = requestLogger;
