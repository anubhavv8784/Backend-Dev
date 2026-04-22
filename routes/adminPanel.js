const express = require("express");

const router = express.Router();

const adminUsers = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "editor", password: "editor123", role: "editor" }
];

function requireAuth(req, res, next) {
  if (!req.session.adminUser) {
    return res.status(401).json({ message: "Please log in first" });
  }

  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.adminUser || !roles.includes(req.session.adminUser.role)) {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    next();
  };
}

router.post("/login", (req, res) => {
  const user = adminUsers.find(
    (entry) => entry.username === req.body.username && entry.password === req.body.password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  req.session.adminUser = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  res.json({
    message: "Admin session started",
    user: req.session.adminUser
  });
});

router.get("/dashboard", requireAuth, (req, res) => {
  res.json({
    message: "Secure admin dashboard",
    user: req.session.adminUser
  });
});

router.get("/reports", requireAuth, requireRole("admin"), (req, res) => {
  res.json({
    message: "Role-based admin report access granted",
    reports: ["sales-summary", "user-growth", "security-audit"]
  });
});

router.post("/logout", requireAuth, (req, res) => {
  req.session.adminUser = null;
  res.json({ message: "Admin session ended" });
});

module.exports = router;
