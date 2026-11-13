const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');

// ثبت‌نام کاربر
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'نام کامل، ایمیل و رمز عبور الزامی هستند.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone`,
      [full_name, email.toLowerCase().trim(), hashedPassword, phone || null]
    );

    res.status(201).json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد.',
      data: result.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'این ایمیل قبلاً ثبت شده است.'
      });
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت‌نام.'
    });
  }
});

// ورود کاربر
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'ایمیل و رمز عبور الزامی هستند.'
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است.'
      });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است.'
      });
    }

    delete user.password_hash;

const token = jwt.sign(
  {
    id: user.id,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

res.status(200).json({
  success: true,
  message: 'ورود با موفقیت انجام شد.',
  token: token,
  data: user
});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'خطا در ورود.'
    });
  }
});

module.exports = router;