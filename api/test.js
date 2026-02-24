const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: "Hello JSON from Express + Vercel!" });
});

app.get('/', (req, res) => {
  res.json({ message: "Hello JSON from Express + Vercel!" });
});

module.exports = app;
module.exports.handler = serverless(app);