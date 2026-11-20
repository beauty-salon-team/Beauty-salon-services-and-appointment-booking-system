const express = require('express');
const router = express.Router();

const {
    registerController,
    loginController
} = require('../controllers/authController');

const {
    validateRegister,
    validateLogin
} = require('../validators/authValidator');

// ثبت‌نام کاربر
router.post('/register', validateRegister, registerController);

// ورود کاربر
router.post('/login', validateLogin, loginController);

module.exports = router;