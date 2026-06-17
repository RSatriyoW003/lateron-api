const express = require('express');
const router = express.Router();
const db = require('../db');
// GET
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM public.users');
    res.json(result.rows);
  } catch (err) {
    console.log("ERROR USERS:", err);
    res.status(500).json({ error: err.message });
  }
});
// POST
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await db.query(
      'INSERT INTO public.users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING *',
      [name, email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log("ERROR POST USERS:", err);
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
    res.status(500).json({ error: err.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(
      `SELECT * FROM public.users
       WHERE email = $1
       AND password_hash = $2`,
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah"
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log("ERROR LOGIN:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {

console.log("UPDATE TERPANGGIL");
    console.log(req.body);

    const {
  name,
  username,
  phone,
  pekerjaan,
  test_date,
  target_score,
  password
} = req.body;

    const result = await db.query(
  `
  UPDATE users
  SET
    name = $1,
    username = $2,
    phone = $3,
    pekerjaan = $4,
    test_date = $5,
    target_score = $6,
    password_hash = COALESCE($7, password_hash)
  WHERE id = $8
  RETURNING *
  `,
  [
  name,
  username,
  phone,
  pekerjaan,
  test_date || null,
  target_score,
  password || null,
  req.params.id
]
);

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;
