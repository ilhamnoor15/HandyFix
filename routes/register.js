const express = require("express");
const app = express.Router();
const db = require("../routes/database");

app.post("/register", async (req, res) => {
  console.log("test 1");

  /*
  CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINC REMENT,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
age INT,
email VARCHAR(255) UNIQUE,
password VARCHAR(255) NOT NULL,
creation_date DATE,
contact_number VARCHAR(20),
address VARCHAR(255),
latitude DECIMAL(9,6),
longitude DECIMAL(9,6),
type VARCHAR(100) NOT NULL DEFAULT 'user' --user, contractor, admin
);

  */

  try {
    const {
      first_name,
      last_name,
      age,
      email,
      password,
      contact_number,
      address,
    } = req.body;

    let contactStr = contact_number?.toString();

    console.log(req.body);

    if (
      !first_name ||
      !last_name ||
      !age ||
      !email ||
      !password ||
      !contact_number
    ) {
      console.log("missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (age && (isNaN(age) || age < 0)) {
      console.log("invalid age");
      return res.status(400).json({ error: "Invalid age" });
    }

    if (contactStr && !/^\+?[0-9]{7,15}$/.test(contactStr)) {
      console.log("invalid contact number");
      return res.status(400).json({ error: "Invalid contact number" });
    }

    if (email.length > 255) {
      console.log("email too long");
      return res.status(400).json({ error: "Email too long" });
    }

    if (password.length > 255) {
      console.log("password too long");
      return res.status(400).json({ error: "Password too long" });
    }

    if (first_name.length > 100 || last_name.length > 100) {
      console.log("name too long");
      return res.status(400).json({ error: "Name too long" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      console.log("password too short");
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    if (first_name.length < 2 || last_name.length < 2) {
      console.log("name too short");
      return res
        .status(400)
        .json({ error: "Name must be at least 2 characters" });
    }

    const result = await db.execute({
      sql: "INSERT INTO users (first_name, last_name, age, email, password, creation_date, contact_number, address) VALUES (?, ?, ?, ?, ?, date('now'), ?, ?)",
      args: [first_name, last_name, age, email, password, contactStr, address],
    });

    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
//test
module.exports = app;
