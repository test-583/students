// routes/events.js - Create, View, Delete Events
const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── GET ALL EVENTS ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [events] = await db.query(
      'SELECT * FROM events ORDER BY date ASC'
    );
    res.json({ success: true, events });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ─── CREATE EVENT (Admin only) ────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { title, description, date, time, venue, userId } = req.body;

  if (!title || !date || !venue) {
    return res.json({ success: false, message: 'Title, date and venue are required' });
  }

  try {
    await db.query(
      'INSERT INTO events (title, description, date, time, venue, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || '', date, time || '', venue, userId]
    );
    res.json({ success: true, message: 'Event created successfully!' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ─── DELETE EVENT (Admin only) ────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    // First delete registrations for this event (to avoid foreign key error)
    await db.query('DELETE FROM registrations WHERE event_id = ?', [req.params.id]);
    // Then delete the event
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Event deleted!' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ─── GET REGISTRATION COUNT FOR AN EVENT ─────────────────────────────────────
router.get('/:id/count', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ?',
      [req.params.id]
    );
    res.json({ success: true, count: rows[0].count });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
