const express = require("express");
const app = express.Router();
const path = require('path');
const { requireAuth } = require("../token"); 
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/home.html'));
});

app.get('/booking', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/bookings.html'))
});

app.get('/messages', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/messages.html'))
});

app.get('/profile', requireAuth,   (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/profile.html'))
});

app.get('/settings', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/settings.html'))
});

app.get('/support', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/support.html'))
});



app.get('/repairs', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, `../../frontend/user/repair.html`))
});

app.get('/initiateRepair', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/user/initiateRepair.html'))
});


module.exports = app;