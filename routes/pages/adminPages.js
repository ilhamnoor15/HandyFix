const express = require("express");
const app = express.Router();
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Admin_Dashboard.html'));
});

app.get('/service', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Service_Requests.html'));
});

app.get('/contractor', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Contractor.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Edit_Categories.html'));
});

app.get('/customers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Customers.html'));
});

app.get('/assignment', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Assignment.html'));
});


app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Messages.html'));
});

app.get('/reports', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Reports.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin/Settings.html'));
});

module.exports = app;