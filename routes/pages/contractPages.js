const express = require("express");
const app = express.Router();
const path = require("path");
const { requireAuth } = require("../token");

app.get("/", requireAuth("contractor"), (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/contractor/contractor_dashboard.html"),
  );
});

app.get("/calendar", requireAuth("contractor"), (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/contractor/contractor_calendar.html"),
  );
});

app.get("/bookings", requireAuth("contractor"), (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/contractor/contractor_bookings.html"),
  );
});

app.get("/messages", requireAuth("contractor"), (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/contractor/contractor_messages.html"),
  );
});

app.get("/profile", requireAuth("contractor"), (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/contractor/contractor_profile.html"),
  );
});

app.get("/settings", requireAuth("contractor"), (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/contractor/contractor_settings.html"),
  );
});

module.exports = app;
