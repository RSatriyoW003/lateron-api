const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua roadmap
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM roadmaps');
  res.json(result.rows);
});

// TEST ROUTE
router.get('/test', (req, res) => {
  res.send('ROADMAP OK');
});

// GET roadmap berdasarkan user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM roadmaps
      WHERE user_id = $1
      ORDER BY generated_at DESC
      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal mengambil roadmap'
    });
  }
});

// POST roadmap
router.post('/', async (req, res) => {
  try {

    console.log('==========================');
    console.log('REQ BODY:');
    console.log(req.body);
    console.log('==========================');

    const {
      user_id,
      test_target_id,
      status,
      roadmap_data
    } = req.body;

    console.log('ROADMAP DATA:');
    console.log(roadmap_data);
    console.log('TYPE:', typeof roadmap_data);

    if (Array.isArray(roadmap_data)) {
      console.log('LENGTH:', roadmap_data.length);
    }

    console.log('==========================');

    const existing = await db.query(
      `
      SELECT id
      FROM roadmaps
      WHERE user_id = $1
      `,
      [user_id]
    );

    // UPDATE jika sudah ada
    if (existing.rows.length > 0) {

      const updated = await db.query(
        `
        UPDATE roadmaps
        SET
          test_target_id = $1,
          status = $2,
          roadmap_data = $3
        WHERE user_id = $4
        RETURNING *
        `,
        [
          test_target_id,
          status,
          JSON.stringify(roadmap_data),
          user_id
        ]
      );

      console.log('ROADMAP BERHASIL DIUPDATE');

      return res.json(updated.rows[0]);
    }

    // INSERT jika belum ada
    const result = await db.query(
      `
      INSERT INTO roadmaps
      (
        user_id,
        test_target_id,
        status,
        roadmap_data
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        user_id,
        test_target_id,
        status,
        JSON.stringify(roadmap_data)
      ]
    );

    console.log('ROADMAP BERHASIL DIINSERT');

    res.json(result.rows[0]);

  } catch (error) {
    console.error('ERROR POST ROADMAP:', error);

    res.status(500).json({
      message: 'Gagal menyimpan roadmap',
      error: error.message
    });
  }
});

module.exports = router;