const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const multiStepRegistrationRoutes = require("./routes/multiStepRegistration");
const languagePreferenceRoutes = require("./routes/languagePreference");
const adminPanelRoutes = require("./routes/adminPanel");
const sessionTimeoutRoutes = require("./routes/sessionTimeout");
const cartRoutes = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "session-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 15 * 60 * 1000,
      httpOnly: true
    }
  })
);

app.use((req, _res, next) => {
  const now = Date.now();
  const warningThreshold = 2 * 60 * 1000;

  if (!req.session.createdAt) {
    req.session.createdAt = now;
  }

  const maxAge = req.session.cookie.maxAge || 0;
  const expiresAt = now + maxAge;
  req.session.lastActivityAt = now;
  req.session.timeoutInfo = {
    expiresAt,
    warningThreshold,
    willWarn: maxAge <= warningThreshold
  };

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Cookies and Sessions assignment API is running",
    languageFromCookie: req.cookies.preferredLanguage || "en",
    routes: {
      multiStepRegistration: [
        "GET /register/step-1",
        "POST /register/step-1",
        "GET /register/step-2",
        "POST /register/step-2",
        "GET /register/step-3",
        "POST /register/step-3",
        "GET /register/summary"
      ],
      languagePreference: [
        "GET /language",
        "POST /language"
      ],
      adminPanel: [
        "POST /admin/login",
        "GET /admin/dashboard",
        "GET /admin/reports",
        "POST /admin/logout"
      ],
      sessionTimeout: [
        "GET /session/status",
        "POST /session/extend"
      ],
      cart: [
        "GET /cart",
        "POST /cart/items",
        "POST /cart/login",
        "POST /cart/logout"
      ]
    }
  });
});

app.use("/register", multiStepRegistrationRoutes);
app.use("/language", languagePreferenceRoutes);
app.use("/admin", adminPanelRoutes);
app.use("/session", sessionTimeoutRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
