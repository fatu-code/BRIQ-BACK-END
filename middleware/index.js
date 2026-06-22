// Wrap async route handlers so thrown errors hit the error middleware.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Pull the client identifier the frontend sends (device id). Required for scoping data.
const requireClient = (req, res, next) => {
  const id = req.header("x-client-id");
  if (!id) return res.status(400).json({ error: "Missing x-client-id header" });
  req.clientId = id;
  next();
};

// Central error handler.
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
};

module.exports = { asyncHandler, requireClient, errorHandler };
