const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const requestLogger = require("./middleware/requestLogger");
const sanitizeInput = require("./middleware/sanitizeInput");
const authenticateMFA = require("./middleware/mfaAuth");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/middlewares_assignment";

app.use(express.json());
app.use(sanitizeInput);
app.use(requestLogger);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection failed:", error.message));

app.get("/", (_req, res) => {
  res.json({
    message: "Middleware assignment API is running",
    routes: [
      "POST /users/register",
      "POST /auth/login",
      "POST /auth/request-otp",
      "POST /auth/logout",
      "PATCH /users/activity",
      "DELETE /users/:id",
      "GET /users",
      "GET /users/deleted",
      "POST /payments/transfer"
    ]
  });
});

app.post("/users/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+password +currentOtp +otpExpiresAt");

    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.isLoggedIn = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "super-secret-key",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      userId: user._id,
      token,
      note: "Request an OTP and include it with a valid JWT for sensitive routes."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/auth/request-otp", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("+currentOtp +otpExpiresAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.currentOtp = "123456";
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    res.json({
      message: "OTP generated for demonstration",
      otp: user.currentOtp,
      expiresAt: user.otpExpiresAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/auth/logout", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isLoggedIn = false;
    user.currentOtp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/users/activity", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.lastActiveAt = new Date();
    await user.save();

    res.json({
      message: "Last activity updated",
      lastActiveAt: user.lastActiveAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users", async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/deleted", async (_req, res) => {
  try {
    const deletedUsers = await User.findDeleted();
    res.json(deletedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User soft deleted successfully" });
  } catch (error) {
    if (error.name === "SoftDeleteComplete") {
      return res.json({ message: "User soft deleted successfully" });
    }

    res.status(500).json({ message: error.message });
  }
});

app.post("/payments/transfer", authenticateMFA, async (req, res) => {
  res.json({
    message: "Sensitive transfer completed",
    performedBy: req.user.email
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
