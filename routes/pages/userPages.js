const express = require("express");
const app = express.Router();
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/home.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/bookings.html'))
});

app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/messages.html'))
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/profile.html'))
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/settings.html'))
});

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/support.html'))
});



app.get('/repairs', (req, res) => {
  res.sendFile(path.join(__dirname, `../../frontend/user/repair.html`))
});

app.get('/initiateRepair', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/initiateRepair.html'))
});


module.exports = app;