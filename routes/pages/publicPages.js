const express = require("express");
const app = express.Router();
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());

app.get("/", (req, res) => {
  const decoded = jwt.decode(req.cookies.auth);
  if (decoded) {
    if (decoded.role === "user") {
      res.redirect("/user/");
    }
    if (decoded.role === "contractor") {
      res.redirect("/contractor/");
    }
    if (decoded.role === "admin") {
      res.redirect("/admin/dashboard");
    }
  }
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/register.html"));
});

module.exports = app;
