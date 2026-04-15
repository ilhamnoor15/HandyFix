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
WHERE u.email = ?
ORDER BY m.ticket_id, m.message_date, m.id;
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
SELECT m.*,
       u.first_name AS user_first_name,
       u.last_name  AS user_last_name,
       t.type       AS ticket_type,
       t.sub_type   AS ticket_sub_type
FROM messages m
INNER JOIN tickets t
    ON m.ticket_id = t.id
INNER JOIN users u
    ON t.user_id = u.id
INNER JOIN assignments a
    ON t.id = a.ticket_id
WHERE a.contractor_id = (SELECT id FROM users WHERE email = ?)
ORDER BY m.ticket_id, m.message_date, m.id;

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
    await db.execute(
      `
           INSERT INTO messages (ticket_id, user_id, message, messager_id, message_date)
           VALUES (
             ?,
             (SELECT id FROM users WHERE email = ?),
             ?,
             (SELECT id FROM users WHERE email = ?),
             datetime('now')
           )
       `,
      [ticket_id, email, content, email],
    );
    console.log("Message sent for email:", email);
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/sendMessagesContractor", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const { ticket_id, content } = req.body;

    console.log("Sending contractor message for email:", email);

    // user_id stays NULL; contractor_id + messager_id are the logged-in contractor.
    await db.execute(
      `
        INSERT INTO messages (ticket_id, contractor_id, message, messager_id, message_date)
        VALUES (
          ?,
          (SELECT id FROM users WHERE email = ?),
          ?,
          (SELECT id FROM users WHERE email = ?),
          datetime('now')
        )
      `,
      [ticket_id, email, content, email],
    );

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contractor message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
//text
