const express = require("express");
const app = express.Router();
const db = require("./database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());
/**
CREATE TABLE tickets (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INT,
order_date DATE,
type VARCHAR(100),
sub_type VARCHAR(100),
description TEXT,
state VARCHAR(100) DEFAULT 'open', --open, closed, cancelled
FOREIGN KEY (user_id) REFERENCES users(id)
);

 */

app.get("/AllTickets", async (req, res) => {
  try {
    const result = await db.execute(
      "SELECT * FROM tickets ORDER BY order_date DESC",
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/AllOpenTickets", async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT * FROM tickets WHERE NOT state IN ('closed', 'cancelled', 'assigned') ORDER BY order_date DESC`,
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/AllRequestAdmin", async (req, res) => {
  try {
    const result = await db.execute(
      `
              SELECT a.*, t.*  FROM assignments a
      INNER JOIN users u ON a.contractor_id = u.id
      INNER JOIN tickets t ON a.ticket_id = t.id
      WHERE t.state != 'closed' AND t.state != 'cancelled';
        `,
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchUserTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching tickets for email:", email);

    const result = await db.execute(
      `
 
SELECT
    t.*,
    u.email AS requester_email,
    c.first_name,
    c.last_name,
    a.reservation AS date,
    t.state AS state,
    f.icon,
    GROUP_CONCAT(f.id) AS fix_ids
FROM tickets t
INNER JOIN users u ON t.user_id = u.id
LEFT JOIN assignments a ON t.id = a.ticket_id
LEFT JOIN users c ON a.contractor_id = c.id
LEFT JOIN fixes f ON f.service = t.type
WHERE u.email = ?
GROUP BY t.id ORDER BY t.order_date DESC;
       `,
      [email],
    );
    console.log("Fetched tickets:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchUserCountTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching user count for email:", email);
    const result = await db.execute(
      `
      SELECT COUNT(*) as count FROM tickets t
      INNER JOIN users u ON t.user_id = u.id
      WHERE u.email = ?;
    `,
      [email],
    );
    console.log("Fetched user count:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchActiveUserCountTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching active user count for email:", email);
    const result = await db.execute(
      `
      SELECT COUNT(*) as count FROM tickets t
      INNER JOIN users u ON t.user_id = u.id
WHERE u.email = ?
AND t.state NOT IN ('closed', 'cancelled');
    `,
      [email],
    );
    console.log("Fetched active user count:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/fetchPendingContractorCountTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching pending contractor count for email:", email);

    const result = await db.execute(
      `
      SELECT COUNT(*) as count FROM assignments a
      INNER JOIN users u ON a.contractor_id = u.id
      INNER JOIN tickets t ON a.ticket_id = t.id
      WHERE u.email = ? AND t.state != 'closed' OR t.state != 'cancelled';
    `,
      [email],
    );
    console.log("Fetched pending contractor count:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchCancelledContractorCountTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching cancelled contractor count for email:", email);

    const result = await db.execute(
      `
      SELECT COUNT(*) as count FROM assignments a
      INNER JOIN users u ON a.contractor_id = u.id
      INNER JOIN tickets t ON a.ticket_id = t.id
      WHERE u.email = ? AND t.state = 'cancelled';
    `,
      [email],
    );
    console.log("Fetched cancelled contractor count:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchCompletedContractorCountTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching completed contractor count for email:", email);

    const result = await db.execute(
      `
      SELECT COUNT(*) as count FROM assignments a
      INNER JOIN users u ON a.contractor_id = u.id
      INNER JOIN tickets t ON a.ticket_id = t.id
      WHERE u.email = ? AND t.state = 'closed';
    `,
      [email],
    );
    console.log("Fetched completed contractor count:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchTotalContractorCountTickets", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching contractor count for email:", email);
    const result = await db.execute(
      `
      SELECT COUNT(*) as count FROM assignments a
      INNER JOIN users u ON a.contractor_id = u.id
      INNER JOIN tickets t ON a.ticket_id = t.id
      WHERE u.email = ?;
    `,
      [email],
    );
    console.log("Fetched contractor count:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchAllUpcomingContractorTickets", async (req, res) => {
  //GET ALL TICKETSFOR CONTRACTOR THAT IS NOT CLOSED OR CANCELLED
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log("Fetching upcoming tickets for email:", email);

    const result = await db.execute(
      `
      SELECT a.*, t.*  FROM assignments a
      INNER JOIN users u ON a.contractor_id = u.id
      INNER JOIN tickets t ON a.ticket_id = t.id
      WHERE u.email = ? AND t.state != 'closed' AND t.state != 'cancelled';
    `,
      [email],
    );
    console.log("Fetched tickets:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/fetchTicket/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const userId = req.params.id;
    const result = await db.execute("SELECT * FROM tickets WHERE id = ?", [
      userId,
    ]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/EditTickets/:id", async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { user_id, order_date, type, sub_type, description, state } =
      req.body;

    const existing = await db.execute("SELECT * FROM tickets WHERE id = ?", [
      ticketId,
    ]);
    if (!existing.rows || existing.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    await db.execute(
      "UPDATE tickets SET user_id = ?, order_date = ?, type = ?, sub_type = ?, description = ?, state = ? WHERE id = ?",
      [
        user_id || existing.rows[0].user_id,
        order_date || existing.rows[0].order_date,
        type || existing.rows[0].type,
        sub_type || existing.rows[0].sub_type,
        description || existing.rows[0].description,
        state || existing.rows[0].state,
        ticketId,
      ],
    );

    const updated = await db.execute("SELECT * FROM tickets WHERE id = ?", [
      ticketId,
    ]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/CountTickets", async (req, res) => {
  try {
    const total = await db.execute("SELECT COUNT(*) as count FROM tickets");
    const totalAssigned = await db.execute(
      "SELECT COUNT(*) as count FROM tickets WHERE state = 'assigned'",
    );
    const totalClosed = await db.execute(
      "SELECT COUNT(*) as count FROM tickets WHERE state = 'closed'",
    );

    res.json({
      total: total.rows[0].count,
      totalAssigned: totalAssigned.rows[0].count,
      totalClosed: totalClosed.rows[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/AddTicket", async (req, res) => {
  try {
    const { user_id, order_date, type, sub_type, description, state } =
      req.body;

    // Insert new user (ID will be auto-incremented)
    await db.execute(
      `INSERT INTO tickets (user_id, order_date, type, sub_type, description, state) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, order_date, type, sub_type, description, state],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/postTicketUser", async (req, res) => {
  /*
  CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer,
	`order_date` numeric,
	`type` text(100),
	`sub_type` text(100),
	`description` text,
	`state` text(100) DEFAULT 'open',
	`address` text,
	`title` text,
	CONSTRAINT `fk_tickets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
  */

  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    const { type, sub_type, description, address, title } = req.body;

    console.log("Posting ticket for email:", email);
    const result = await db.execute(
      `
           INSERT INTO tickets (user_id, type, sub_type, description, address, title)
           VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, ?, ?)
       `,
      [email, type, sub_type, description, address, title],
    );
    console.log("Ticket posted for email:", email);
    res.json({ message: "Ticket posted successfully" });
  } catch (error) {
    console.error("Error posting ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/submitServiceRequest", async (req, res) => {
  /*
  service: 'Wall Patching & Minor Repairs',
  issue: 'Wall Patching & Minor Repairs – Patching damaged drywall',
  date: '6345-05-31',
  reservation_low: '13:00',
  reservation_high: '17:00',
  contact: '56453',
  address: '456456',
  landmark: '654546'

    fetch("/api/submitServiceRequest", {
      method: "POST",
      credentials: "include",
      body: formData,
    })


    TABLE:
  idPK	INTEGER	
user_id	INT	
order_date	DATE	
type	VARCHAR(100)	
sub_type	VARCHAR(100)	
description	TEXT	
state	VARCHAR(100)	default: 'open'
address	TEXT
title  TEXT



{
  service: 'Wall Patching & Minor Repairs',
  issue: 'Maintenance – Wall Patching & Minor Repairs – Patching damaged drywall',
  date: '275760-05-24',
  reservation_low: '13:00',
  reservation_high: '17:00',
  contact: '09193197805',
  address: 'not required',
  landmark: '',
  genre: 'Maintenance',
  description: '2314r2r3'
}
  */
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    console.log(req.body);

    let {
      service,
      issue,
      date,
      reservation_low,
      reservation_high,
      contact,
      address,
      landmark,
      description,
      genre,
    } = req.body;

    if (landmark) {
      address = `${address}, (${landmark})`;
    }

    const result = await db.execute(
      `
        INSERT INTO tickets (
  user_id,
  order_date,
  type,
  sub_type,
  title,
  description,
  address,
  reservation_low,
  reservation_high,
  phone_number,
  reservation_date
)
VALUES (
  (SELECT id FROM users WHERE email = ?),
  strftime('%d/%m/%Y', 'now'),
  ?, ?, ?, ?, ?, ?, ?, ?, ?
)
       `,
      [
        email,
        genre,
        service,
        issue,
        description,
        address,
        reservation_low,
        reservation_high,
        contact,
        date,
      ],
    );

    console.log("Service request submitted for email:", email);
    res.json({
      message: "Service request submitted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error submitting service request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/AssignContractor", async (req, res) => {
  try {
    const { ticketId, contractorId } = req.body;

    console.log(req.body);

    //RESERVATION FORMAT: YYYY-MM-DD
    //RESERVATION BASED ON THE TICKETS TABLE, RESERVATION IN ASSIGNMENTS IS ONLY FOR TODAY

    await db.execute(
      `INSERT INTO assignments (ticket_id, contractor_id, reservation) 
       VALUES (?, ?, datetime('now', '+1 day'))`,
      [ticketId, contractorId],
    );

    await db.execute(`UPDATE tickets SET state = 'assigned' WHERE id = ?`, [
      ticketId,
    ]);

    /*create an empty set of messages for the messages. so its displayed in messages nav.
    
    idPK	INTEGER	
ticket_id	INT	
user_id	INT	
contractor_id	INT	
message	VARCHAR(100)	
messager_id	INT	
message_date	DATE.

like
ticket_id=5, user_id=1, message=null, messager_id=null, message_date=current date
ticket_id=5, contractor_id=1, message=null, messager_id=null, message_date=current date
important 2 queries seperate. one for with user_id, other for contractor_id. because messages are fetched with user_id and contractor_id, if both are null, messages are not fetched. so we need to insert 2 rows for each ticket assignment, one with user_id and other with contractor_id, both with null message and current date. so when messages are fetched, it will return an empty array instead of null, and the messages nav will be displayed. if we dont do this, messages nav will not be displayed because messages are null, even though there is an assignment and a ticket.
*/

    await db.execute(
      `INSERT INTO messages (ticket_id, user_id, message, messager_id, message_date) 
       VALUES (?, (SELECT user_id FROM assignments WHERE ticket_id = ?), NULL, NULL, datetime('now'))`,
      [ticketId, ticketId],
    );

    await db.execute(
      `INSERT INTO messages (ticket_id, contractor_id, message, messager_id, message_date) 
       VALUES (?, (SELECT contractor_id FROM assignments WHERE ticket_id = ?), NULL, NULL, datetime('now'))`,
      [ticketId, ticketId],
    );
    res.json({ message: "Contractor assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchAssignments", async (req, res) => {
  try {
    /*
    	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer,
	`contractor_id` integer,
	`reservation` text,
	`ticket_id` text,
	CONSTRAINT `fk_assignments_contractor_id_users_id_fk` FOREIGN KEY (`contractor_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_assignments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)

    
    
    
    fetch all tickets, return id, costumers name, contractors name, fetch both names from user ID, looked with user_id and contractor_id */
    const result = await db.execute(
      `
SELECT a.id as jobId, t.type||' - '||t.sub_type as service_name, u1.first_name AS customer_first_name, u1.last_name AS customer_last_name, u2.first_name AS contractor_first_name, u2.last_name AS contractor_last_name, t.state AS ticket_state
FROM assignments a
INNER JOIN users u1 ON a.user_id = u1.id
INNER JOIN users u2 ON a.contractor_id = u2.id
INNER JOIN tickets t ON a.ticket_id = t.id

      `,
    );

    console.log("Fetched assignment:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchTicketDetailsContractor", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;

    //fetch all the tickets with the contractor email from users, the name of user too.
    const result = await db.execute(
      `
      select t.*, u.first_name||' '||u.last_name as customer_name from tickets t
      inner join users u on t.user_id = u.id
      inner join assignments a on t.id = a.ticket_id
      inner join users c on a.contractor_id = c.id
      where c.email = ? and t.state != 'closed' and t.state != 'cancelled'
       `,
      [email],
    );

    console.log("Fetched assignment:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/CloseTicketContractor", async (req, res) => {
  try {
    const { ticketId } = req.body;
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    //update ticket state to closed, but only if the contractor is assigned to the ticket
    await db.execute(
      `UPDATE tickets SET state = 'closed' WHERE id = ? AND id IN (SELECT ticket_id FROM assignments WHERE contractor_id = (SELECT id FROM users WHERE email = ?))`,
      [ticketId, email],
    );
    res.json({ message: "Ticket closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/fetchAllAssignedTicketsContractor", async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.auth);
    const email = decoded.email;
    //fetch all the tickets with the contractor email from users, the name of user too.
    const result = await db.execute(
      `
      select t.*, u.first_name||' '||u.last_name as customer_name from tickets t
      inner join users u on t.user_id = u.id
      inner join assignments a on t.id = a.ticket_id
      inner join users c on a.contractor_id = c.id
      where c.email = ?
       `,
      [email],
    );

    console.log("Fetched assignment:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = app;
