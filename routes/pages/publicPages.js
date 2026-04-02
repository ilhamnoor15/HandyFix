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
      return res.redirect("/user/");
    }
    if (decoded.role === "contractor") {
      return res.redirect("/contractor/");
    }
    if (decoded.role === "admin") {
      return res.redirect("/admin/dashboard");
    }
  }
  return res.redirect("/login");
});

app.get("/login", (req, res) => {
  return res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

app.get("/register", (req, res) => {
  return res.sendFile(
    path.join(__dirname, "../../frontend/public/register.html"),
  );
});

module.exports = app;
