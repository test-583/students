// routes/auth.js - Handles Signup and Login
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if email already used
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    // Hash password before saving (never store plain passwords)
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, 'student']
    );

    res.json({ success: true, message: 'Account created! Please login.' });
  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: 'No account found with this email' });
    }

    const user = rows[0];

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Wrong password' });
    }

    // Send back user info (never send password!)
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
