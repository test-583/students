// server.js - This is the brain of our backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

// Allow requests from any frontend (Netlify)
app.use(cors({ origin: '*' }));

// Allow server to read JSON data sent from frontend
app.use(express.json());

// Connect all route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/register', require('./routes/register'));

// Health check - visiting this URL tells you server is alive
app.get('/', (req, res) => {
  res.json({ message: 'Student Event System API is running!' });
});

// ─── AUTO CREATE ADMIN ON STARTUP ───────────────────────────────────────────
// This runs once when server starts - creates admin if doesn't exist
async function seedAdmin() {
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', ['admin@college.com']);
    if (rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', 'admin@college.com', hash, 'admin']
      );
      console.log('✅ Admin auto-created → Email: admin@college.com | Password: admin123');
    } else {
      console.log('✅ Admin already exists');
    }
  } catch (err) {
    console.log('⚠️ Admin seed error (DB might not be ready yet):', err.message);
  }
}

seedAdmin();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
