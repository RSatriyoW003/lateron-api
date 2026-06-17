const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// SIMPAN HASIL QUIZ
// =========================
router.post('/submit', async (req, res) => {

  console.log("BODY MASUK:", req.body);

  try {

    const {
      user_id,
      week_id,
      day_id,
      score,
      total_questions,
      completed
    } = req.body;

    // Cek apakah quiz sudah ada
    const existing = await pool.query(
      `
      SELECT id
      FROM quiz_results
      WHERE
        user_id = $1
        AND week_id = $2
        AND day_id = $3
      `,
      [user_id, week_id, day_id]
    );

    // Jika sudah ada -> UPDATE
    if (existing.rows.length > 0) {

      const updated = await pool.query(
        `
        UPDATE quiz_results
        SET
          score = $1,
          total_questions = $2,
          completed = $3
        WHERE
          user_id = $4
          AND week_id = $5
          AND day_id = $6
        RETURNING *
        `,
        [
          score,
          total_questions,
          completed,
          user_id,
          week_id,
          day_id
        ]
      );

      return res.json(updated.rows[0]);
    }

    // Jika belum ada -> INSERT
    const result = await pool.query(
      `
      INSERT INTO quiz_results
      (
        user_id,
        week_id,
        day_id,
        score,
        total_questions,
        completed
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        user_id,
        week_id,
        day_id,
        score,
        total_questions,
        completed
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Gagal menyimpan hasil quiz'
    });

  }

});

// =========================
// AMBIL HASIL QUIZ USER
// =========================
router.get('/results/:userId', async (req, res) => {

  try {

    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM quiz_results
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Gagal mengambil hasil quiz'
    });

  }

});

module.exports = router;