const express = require("express");

const router = express.Router();

router.get("/status", (req, res) => {
  const now = Date.now();
  const expiryDate = new Date(req.session.cookie.expires || now);
  const remainingMs = Math.max(expiryDate.getTime() - now, 0);
  const warningThreshold = 2 * 60 * 1000;

  res.json({
    message: remainingMs <= warningThreshold
      ? "Warning: your session is about to expire"
      : "Session is still active",
    remainingMs,
    remainingMinutes: Number((remainingMs / 60000).toFixed(2)),
    shouldWarn: remainingMs <= warningThreshold
  });
});

router.post("/extend", (req, res) => {
  req.session.cookie.maxAge = 15 * 60 * 1000;

  res.json({
    message: "Session extended successfully",
    newMaxAgeMs: req.session.cookie.maxAge
  });
});

module.exports = router;
