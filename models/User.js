const mongoose = require("mongoose");
const softDeletePlugin = require("../plugins/softDeletePlugin");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    loginHistory: {
      type: [Date],
      default: []
    },
    logoutHistory: {
      type: [Date],
      default: []
    },
    lastActiveAt: {
      type: Date,
      default: null
    },
    currentOtp: {
      type: String,
      select: false,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      select: false,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", function trackUserActivity(next) {
  if (this.isNew) {
    this.lastActiveAt = new Date();
  }

  if (this.isModified("isLoggedIn")) {
    const now = new Date();

    if (this.isLoggedIn) {
      this.loginHistory.push(now);
      this.lastActiveAt = now;
    } else {
      this.logoutHistory.push(now);
      this.lastActiveAt = now;
    }
  }

  next();
});

userSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function updateActivityTimestamp(next) {
  this.set({ lastActiveAt: new Date() });
  next();
});

userSchema.plugin(softDeletePlugin);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
