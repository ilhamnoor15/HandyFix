const express = require("express");
const app = express.Router();
const path = require("path");
const { requireAuth } = require("../token");
app.get("/", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/user/home.html"));
});

app.get("/booking", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/user/bookings.html"));
});

app.get("/messages", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/user/messages.html"));
});

app.get("/profile", requireAuth("user"), (req, res) => {
  const query = req.query;
  if (query.preview === "true") {
    res.sendFile(path.join(__dirname, "../../frontend/user/personal.html"));
  }

  if (query.history === "true") {
    res.sendFile(path.join(__dirname, "../../frontend/user/service.html"));
  }
  res.sendFile(path.join(__dirname, "../../frontend/user/profile.html"));
});

app.get("/settings", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/user/personal.html"));
});

app.get("/support", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/user/support.html"));
});

app.get("/repairs", requireAuth("user"), (req, res) => {
  const query = req.query;

  if (query.service || query.sub) {
    const service = query.sub.toLowerCase().trim().replace(/\s+/g, "_");
    console.log(service);
    return res.sendFile(
      path.join(__dirname, `../../frontend/user/${service}.html`),
    );
  }

  res.sendFile(path.join(__dirname, `../../frontend/user/repair.html`));
});

app.get("/initiateRepair", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/user/initiateRepair.html"));
});

module.exports = app;
