const express = require('express');
const router = express.Router();
const pool = require('../db');

// دریافت فهرست متخصص‌های سالن
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM specialists ORDER BY id'
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فهرست متخصص‌ها.'
    });
  }
});

module.exports = router;