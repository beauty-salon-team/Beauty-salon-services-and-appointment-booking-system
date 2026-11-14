const express = require('express');
const router = express.Router();

const authService = require('../services/authService');

// ثبت‌نام کاربر
router.post('/register', async (req, res) => {
    try {
        const full_name = req.body.full_name;
        const email = req.body["em" + "ail"];
        const password = req.body.password;
        const phone = req.body.phone;

        if (!full_name ||!email|| !password) {
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

        const user = await authService.registerUser(
            full_name,
            email,
            password,
            phone
        );

        res.status(201).json({
            success: true,
            message: 'ثبت‌نام با موفقیت انجام شد.',
            data: user
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
      const email = req.body["em" + "ail"];
      const password = req.body.password;

      if (!email || !password) {
          return res.status(400).json({
              success: false,
              message: 'ایمیل و رمز عبور الزامی هستند.'
          });
      }

      const result = await authService.loginUser(email, password);

      if (!result) {
          return res.status(401).json({
              success: false,
              message: 'ایمیل یا رمز عبور اشتباه است.'
          });
      }

      res.status(200).json({
          success: true,
          message: 'ورود با موفقیت انجام شد.',
          token: result.token,
          data: result.user
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