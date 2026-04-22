const express = require("express");

const router = express.Router();

function renderStep(title, body) {
  return `
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        ${body}
      </body>
    </html>
  `;
}

router.get("/step-1", (req, res) => {
  const registration = req.session.registration || {};

  res.send(
    renderStep(
      "Registration Step 1",
      `
        <form method="POST" action="/register/step-1">
          <label>Name</label>
          <input type="text" name="name" value="${registration.name || ""}" required />
          <label>Email</label>
          <input type="email" name="email" value="${registration.email || ""}" required />
          <button type="submit">Next</button>
        </form>
      `
    )
  );
});

router.post("/step-1", (req, res) => {
  req.session.registration = {
    ...(req.session.registration || {}),
    name: req.body.name,
    email: req.body.email
  };

  res.redirect("/register/step-2");
});

router.get("/step-2", (req, res) => {
  if (!req.session.registration) {
    return res.redirect("/register/step-1");
  }

  const registration = req.session.registration;

  res.send(
    renderStep(
      "Registration Step 2",
      `
        <form method="POST" action="/register/step-2">
          <label>Phone</label>
          <input type="text" name="phone" value="${registration.phone || ""}" required />
          <label>Address</label>
          <input type="text" name="address" value="${registration.address || ""}" required />
          <button type="submit">Next</button>
        </form>
      `
    )
  );
});

router.post("/step-2", (req, res) => {
  req.session.registration = {
    ...(req.session.registration || {}),
    phone: req.body.phone,
    address: req.body.address
  };

  res.redirect("/register/step-3");
});

router.get("/step-3", (req, res) => {
  if (!req.session.registration) {
    return res.redirect("/register/step-1");
  }

  const registration = req.session.registration;

  res.send(
    renderStep(
      "Registration Step 3",
      `
        <form method="POST" action="/register/step-3">
          <label>Username</label>
          <input type="text" name="username" value="${registration.username || ""}" required />
          <label>Password</label>
          <input type="password" name="password" required />
          <button type="submit">Finish</button>
        </form>
      `
    )
  );
});

router.post("/step-3", (req, res) => {
  req.session.registration = {
    ...(req.session.registration || {}),
    username: req.body.username,
    password: req.body.password
  };

  res.redirect("/register/summary");
});

router.get("/summary", (req, res) => {
  if (!req.session.registration) {
    return res.redirect("/register/step-1");
  }

  const registration = { ...req.session.registration };
  delete registration.password;

  res.json({
    message: "Multi-step registration completed using sessions",
    registration
  });
});

module.exports = router;
