const express = require("express");
const app = express.Router();
const db = require("./database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());

app.get("/fetchMessages", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching messages for email:", email);

    const result = await db.execute(
      `
SELECT m.*
FROM messages m
INNER JOIN tickets t
    ON m.ticket_id = t.id
INNER JOIN users u
    ON t.user_id = u.id
WHERE u.email = ?;
       `,
      [email],
    );

    console.log("Messages fetched:", result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchMessagesContractor", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching messages for email:", email);

    const result = await db.execute(
      `
SELECT m.*
FROM messages m
INNER JOIN tickets t
    ON m.ticket_id = t.id
INNER JOIN users u
    ON t.user_id = u.id
INNER JOIN assignments a
    ON t.id = a.ticket_id
WHERE a.contractor_id = (SELECT id FROM users WHERE email = ?);

       `,
      [email],
    );

    console.log("Messages fetched:", result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/sendMessageUser", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const { ticket_id, content } = req.body;

    console.log("Sending message for email:", email);
    const result = await db.execute(
      `
           INSERT INTO messages (ticket_id, content, user_id)
           VALUES (?, ?, (SELECT id FROM users WHERE email = ?))
       `,
      [ticket_id, content, email],
    );
    console.log("Message sent for email:", email);
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
//text
