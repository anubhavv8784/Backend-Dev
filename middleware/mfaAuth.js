const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateMFA(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const otpCode = req.headers["x-otp-code"];

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "JWT token is required" });
    }

    if (!otpCode) {
      return res.status(401).json({ message: "OTP code is required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super-secret-key");
    const user = await User.findById(decoded.userId).select("+currentOtp +otpExpiresAt");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const otpExpired = !user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now();

    if (user.currentOtp !== otpCode || otpExpired) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    user.lastActiveAt = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
}

module.exports = authenticateMFA;
