const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_testing";

const requireAuth = (req, res, next) => {
  const token = req.cookies?.auth; // <- read from cookie

  if (!token) return res.redirect('/login'); // <- redirect to login if no token

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ error: "Forbidden: Invalid token" });

    req.user = decodedUser;
    next();
  });
};

module.exports = { requireAuth };