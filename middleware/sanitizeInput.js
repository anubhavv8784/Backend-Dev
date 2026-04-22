function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeValue(value) {
  if (typeof value === "string") {
    return escapeHtml(value)
      .replace(/\$/g, "")
      .replace(/\b(select|insert|update|delete|drop|union|truncate|alter)\b/gi, "");
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).reduce((sanitizedObject, key) => {
      sanitizedObject[key] = sanitizeValue(value[key]);
      return sanitizedObject;
    }, {});
  }

  return value;
}

function sanitizeInput(req, _res, next) {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  next();
}

module.exports = sanitizeInput;
