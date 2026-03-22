const express = require("express");
const app = express.Router();
const db = require("./database");

app.get("/AllUsers", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM users");

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/EditUsers/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const userId = req.params.id;
    const result = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/EditUsers/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      first_name,
      last_name,
      email,
      password,
      age,
      contact_number,
      address,
      type,
    } = req.body;

    // Verify user exists
    const existsResult = await db.execute("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);

    if (!existsResult.rows || existsResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user
    await db.execute(
      `UPDATE users SET 
        first_name = ?, 
        last_name = ?, 
        email = ?, 
        password = ?, 
        age = ?, 
        contact_number = ?, 
        address = ?, 
        type = ? 
       WHERE id = ?`,
      [
        first_name,
        last_name,
        email,
        password,
        age,
        contact_number,
        address,
        type,
        userId,
      ],
    );

    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;
