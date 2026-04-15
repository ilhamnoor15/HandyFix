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

app.get("/AllCustomerUsers", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM users WHERE type = 'user'");

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/AllContractorUsers", async (req, res) => {
  try {
    const result = await db.execute(
      "SELECT * FROM users WHERE type = 'contractor'",
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchUser/:id", async (req, res) => {
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

app.post("/AddUser", async (req, res) => {
  try {
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

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !type) {
      return res.status(400).json({
        error:
          "Missing required fields: first_name, last_name, email, password, type",
      });
    }

    // Insert new user (ID will be auto-incremented)
    const result = await db.execute(
      `INSERT INTO users (first_name, last_name, email, password, age, contact_number, address, type, creation_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        password,
        age || null,
        contact_number || null,
        address || null,
        type,
        new Date().toISOString().split("T")[0], // creation_date as YYYY-MM-DD
      ],
    );

    res.json({
      success: true,
      message: "User added successfully",
    });
  } catch (err) {
    console.error(err);
    // Handle unique constraint violation (email already exists)
    if (err.message && err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;
