// routes/register.js - Register students for events
const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── REGISTER FOR AN EVENT ────────────────────────────────────────────────────
router.post('/:eventId', async (req, res) => {
  const { userId } = req.body;
  const { eventId } = req.params;

  if (!userId) {
    return res.json({ success: false, message: 'User not logged in' });
  }

  try {
    // Check if already registered
    const [existing] = await db.query(
      'SELECT id FROM registrations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );

    if (existing.length > 0) {
      return res.json({ success: false, message: 'You already registered for this event!' });
    }

    await db.query(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [userId, eventId]
    );

    res.json({ success: true, message: 'Successfully registered for event!' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ─── GET MY REGISTERED EVENTS ─────────────────────────────────────────────────
router.get('/my/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.*, r.registered_at 
       FROM events e
       JOIN registrations r ON e.id = r.event_id
       WHERE r.user_id = ?
       ORDER BY e.date ASC`,
      [req.params.userId]
    );
    res.json({ success: true, events: rows });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ─── GET ALL REGISTRATIONS (Admin use) ───────────────────────────────────────
router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.id, u.name as student_name, u.email, e.title as event_title, r.registered_at
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       JOIN events e ON r.event_id = e.id
       ORDER BY r.registered_at DESC`
    );
    res.json({ success: true, registrations: rows });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
