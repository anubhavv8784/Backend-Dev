const express = require("express");

const router = express.Router();

const greetings = {
  en: "Welcome",
  hi: "स्वागत है",
  fr: "Bienvenue",
  es: "Bienvenido"
};

router.get("/", (req, res) => {
  const language = req.cookies.preferredLanguage || "en";

  res.json({
    message: greetings[language] || greetings.en,
    selectedLanguage: language,
    availableLanguages: Object.keys(greetings)
  });
});

router.post("/", (req, res) => {
  const language = req.body.language || "en";

  res.cookie("preferredLanguage", language, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "lax"
  });

  res.json({
    message: "Language preference saved in cookies",
    selectedLanguage: language
  });
});

module.exports = router;
