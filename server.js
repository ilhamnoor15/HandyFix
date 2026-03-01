const express = require('express');
const app = express();
require('dotenv').config();
const { createClient } = require('@libsql/client');

const PORT = process.env.PORT || 3000;


function getDbClient() {
  if (!process.env.TURSO_LINK || !process.env.TURSO_TOKEN) {
    throw new Error('Database not configured');
  }

  return createClient({
    url: process.env.TURSO_LINK,
    authToken: process.env.TURSO_TOKEN,
  });
}


app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, JSON world!' });
});

app.get('/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.get('/test', (req, res) => {
  res.json({ messages: "Vercel says: Hello! I am running off this mfin server!" });
})

app.post('/post', (req, res) => {
  const data = req.body;

    if (data.message) {
    data.message = data.message.toUpperCase() + " AND I LOVE YOU!!!";
  }


  res.json(data);
})

app.get('/test-db', async (req, res) => {
  const db =
  getDbClient(); 
  try {
    const result = await db.execute('SELECT 1 as result');
    res.json({ success: true, message: 'Connected to Turso DB!', data: result.rows });
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/login', async (req, res) => {

  const db = getDbClient();
  try {
    const { email, password } = req.body;

    const result = await db.execute({
      sql: "SELECT id, email, password FROM users WHERE email = ?",
      args: [email],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ success: true, user: { id: user.id, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
