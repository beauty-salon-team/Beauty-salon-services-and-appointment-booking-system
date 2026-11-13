const express = require('express');
const router = express.Router();
const pool = require('../db');

// دریافت تمام خدمات از دیتابیس
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services ORDER BY id'
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت خدمات'
    });
  }
});

// دریافت یک خدمت بر اساس شناسه
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'خدمت موردنظر پیدا نشد.'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت خدمت'
    });
  }
});

module.exports = router;