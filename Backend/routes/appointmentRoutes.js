const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');

const {
    validateAppointment
} = require('../validators/appointmentValidator');

const {
    createAppointment,
    getUserAppointments,
    cancelAppointment
} = require('../controllers/appointmentController');

// ثبت رزرو نوبت
router.post(
    '/',
    authenticateToken,
    validateAppointment,
    createAppointment
);

// نمایش نوبت‌های کاربر
router.get(
    '/',
    authenticateToken,
    getUserAppointments
);

// لغو نوبت
router.patch(
    '/:id/cancel',
    authenticateToken,
    cancelAppointment
);

module.exports = router;