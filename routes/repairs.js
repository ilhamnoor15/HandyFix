const express = require("express");
const app = express.Router();
const db = require("./database");

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



app.get("/repairsList/:repairType", async (req, res) => {
  console.log(req.params.repairType);
  try {
    const repairType = req.params.repairType;
    const result = await db.execute(
      "SELECT * FROM fixes WHERE LOWER(service) = LOWER(?)", // fix casing
      [repairType]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Repair not found" }); // this was triggering
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = app;
