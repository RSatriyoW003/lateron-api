const express = require('express');
const router = express.Router();
const db = require('../db');

// GET
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM users');
  res.json(result.rows);
});

// POST
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING *',
      [name, email, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;