const express = require("express");
const app = express.Router();
const db = require("../routes/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());
/*

const response = await fetch('/api/fetchProfile');

(expects)
let profileData = {
                name: '',
                phone: '',
                avatar: '',
                membershipType: '',
                memberSince: ''
            };



fetch('/api/editProfileUser', {
                method: 'POST',
                credentials: 'include',          // sends the auth cookie
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

(posts)
const payload = {
            first_name:     document.getElementById('first_name').value.trim(),
            last_name:      document.getElementById('last_name').value.trim(),
            contact_number: document.getElementById('contact_number').value.trim(),
            address:        document.getElementById('address').value.trim()
        };



            const res = await fetch('/api/fetchProfileUser', {
                method: 'GET',
                credentials: 'include'   // sends the auth cookie
            });

            (expects)
            document.getElementById('first_name').value    = user.first_name    || '';
            document.getElementById('last_name').value     = user.last_name     || '';
            document.getElementById('email').value         = user.email         || '';
            document.getElementById('contact_number').value = user.contact_number || '';
            document.getElementById('address').value       = user.address       || '';

*/

app.get("/fetchProfile", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const result = await db.execute(
      "SELECT first_name||' '||last_name as name,  contact_number as phone, SUBSTR(first_name, 1, 1)||SUBSTR(last_name, 1, 1) as avatar, creation_date as memberSince FROM users WHERE email = ?",
      [email],
    );
    console.log(result.rows);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/editProfileUser", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const { first_name, last_name, contact_number, address } = req.body;
    await db.execute(
      "UPDATE users SET first_name = ?, last_name = ?, contact_number = ?, address = ? WHERE email = ?",
      [first_name, last_name, contact_number, address, email],
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchProfileUser", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const result = await db.execute(
      "SELECT first_name, last_name, email, contact_number, address FROM users WHERE email = ?",
      [email],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchContactAddress", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const result = await db.execute(
      "SELECT contact_number, address FROM users WHERE email = ?",
      [email],
    );
    console.log(result.rows);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;
//text
