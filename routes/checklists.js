const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua checklist
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM checklists');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Gagal mengambil checklist'
    });
  }
});

// POST checklist baru
router.post('/', async (req, res) => {
  try {

    const {
      user_id,
      daily_schedule_id
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO checklists
      (
        user_id,
        daily_schedule_id
      )
      VALUES ($1,$2)
      RETURNING *
      `,
      [user_id, daily_schedule_id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Gagal membuat checklist'
    });

  }
});

// UPDATE STATUS CHECKLIST
router.put('/:id', async (req, res) => {

  try {

    const { id } = req.params;
    const { is_done } = req.body;

    const result = await db.query(
      `
      UPDATE checklists
      SET
        is_done = $1,
        completed_at =
          CASE
            WHEN $1 = true THEN NOW()
            ELSE NULL
          END
      WHERE id = $2
      RETURNING *
      `,
      [is_done, id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Gagal update checklist'
    });

  }

});

module.exports = router;