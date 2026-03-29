const express = require("express");
const app = express.Router();
const db = require("../routes/database");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    const result = await db.execute({
      sql: "SELECT id, email, password FROM users WHERE email = ?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("auth", token, {
      httpOnly: true,   // cannot be read by JavaScript
      secure: false,    // set true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });


    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;