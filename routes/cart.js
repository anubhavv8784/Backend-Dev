const express = require("express");

const router = express.Router();

const users = [
  { id: 1, username: "customer", password: "customer123" }
];

function getGuestCart(req) {
  try {
    return JSON.parse(req.cookies.guestCart || "[]");
  } catch (_error) {
    return [];
  }
}

function saveGuestCart(res, cart) {
  res.cookie("guestCart", JSON.stringify(cart), {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "lax"
  });
}

function mergeCarts(sessionCart, guestCart) {
  const merged = [...sessionCart];

  guestCart.forEach((guestItem) => {
    const existingItem = merged.find((item) => item.productId === guestItem.productId);

    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem);
    }
  });

  return merged;
}

router.get("/", (req, res) => {
  const authenticated = Boolean(req.session.user);
  const cart = authenticated ? req.session.cart || [] : getGuestCart(req);

  res.json({
    authenticated,
    cart
  });
});

router.post("/items", (req, res) => {
  const item = {
    productId: req.body.productId,
    name: req.body.name,
    quantity: Number(req.body.quantity || 1)
  };

  if (req.session.user) {
    req.session.cart = [...(req.session.cart || []), item];

    return res.json({
      message: "Item added to session cart",
      cart: req.session.cart
    });
  }

  const guestCart = getGuestCart(req);
  guestCart.push(item);
  saveGuestCart(res, guestCart);

  res.json({
    message: "Item added to guest cart cookie",
    cart: guestCart
  });
});

router.post("/login", (req, res) => {
  const user = users.find(
    (entry) => entry.username === req.body.username && entry.password === req.body.password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid cart login credentials" });
  }

  const guestCart = getGuestCart(req);
  const sessionCart = req.session.cart || [];

  req.session.user = {
    id: user.id,
    username: user.username
  };
  req.session.cart = mergeCarts(sessionCart, guestCart);

  res.clearCookie("guestCart");
  res.json({
    message: "Logged in and migrated guest cart to session cart",
    cart: req.session.cart
  });
});

router.post("/logout", (req, res) => {
  const currentCart = req.session.cart || [];

  saveGuestCart(res, currentCart);
  req.session.user = null;
  req.session.cart = [];

  res.json({
    message: "Logged out and moved current cart back to guest cookie storage"
  });
});

module.exports = router;
