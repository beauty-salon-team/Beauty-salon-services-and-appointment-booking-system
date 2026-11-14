const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');
const { checkAppointmentData } = require('../services/appointmentService');

// ثبت رزرو نوبت
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      service_id,
      specialist_id,
      appointment_date,
      appointment_time
    } = req.body;

    // شناسه کاربر از توکن گرفته می‌شود
    const user_id = req.user.id;

    // بررسی اطلاعات اجباری
    if (
      !service_id ||
      !specialist_id ||
      !appointment_date ||
      !appointment_time
    ) {
      return res.status(400).json({
        success: false,
        message: 'تمام اطلاعات رزرو الزامی هستند.'
      });
    }

    // بررسی معتبر بودن شناسه‌ها
    if (
      !Number.isInteger(Number(user_id)) ||
      Number(user_id) <= 0 ||
      !Number.isInteger(Number(service_id)) ||
      Number(service_id) <= 0 ||
      !Number.isInteger(Number(specialist_id)) ||
      Number(specialist_id) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'شناسه‌های کاربر، خدمت و متخصص معتبر نیستند.'
      });
    }

    // بررسی وجود کاربر
    const userResult = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'کاربر مورد نظر پیدا نشد.'
      });
    }

   // بررسی وجود متخصص و خدمت
const appointmentData = await checkAppointmentData(
  service_id,
  specialist_id
);

if (appointmentData.error) {
  return res.status(appointmentData.status).json({
    success: false,
    message: appointmentData.error
  });
}

const serviceResult = {
  rows: [appointmentData.service]
};

const specialistResult = {
  rows: [appointmentData.specialist]
};
 
    // بررسی معتبر بودن تاریخ
    const selectedDate = new Date(appointment_date);
    const today = new Date();

    if (
      isNaN(selectedDate.getTime()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date) ||
      selectedDate.toISOString().slice(0, 10) !== appointment_date
    ) {
      return res.status(400).json({
        success: false,
        message: 'تاریخ وارد شده معتبر نیست.'
      });
    }

    selectedDate.setUTCHours(0, 0, 0, 0);
    today.setUTCHours(0, 0, 0, 0);

    // جلوگیری از رزرو تاریخ گذشته
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'امکان رزرو نوبت در تاریخ گذشته وجود ندارد.'
      });
    }

    // بررسی فرمت ساعت
    const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
      String(appointment_time)
    );

    if (!timeMatch) {
      return res.status(400).json({
        success: false,
        message: 'فرمت ساعت وارد شده معتبر نیست.'
      });
    }

    // تبدیل ساعت به دقیقه
    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);

    const appointmentMinutes = hour * 60 + minute;

    // ساعات کاری سالن
    const openingMinutes = 9 * 60;
    const closingMinutes = 18 * 60;

    if (
      appointmentMinutes < openingMinutes ||
      appointmentMinutes >= closingMinutes
    ) {
      return res.status(400).json({
        success: false,
        message: 'ساعات کاری متخصص‌ها از ۹ صبح تا ۶ عصر است.'
      });
    }

    // مدت زمان خدمت
    const duration = serviceResult.rows[0].duration_minutes;

    // محاسبه زمان پایان نوبت
    const newStart = hour * 60 + minute;
    const newEnd = newStart + duration;

    if (newEnd > closingMinutes) {
      return res.status(400).json({
        success: false,
        message: 'زمان این خدمت از ساعات کاری سالن بیشتر است.'
      });
    }

    // دریافت نوبت‌های فعال متخصص در همان تاریخ
    const existingAppointments = await pool.query(
      `SELECT
         appointments.appointment_time,
         services.duration_minutes
       FROM appointments
       JOIN services
         ON appointments.service_id = services.id
       WHERE appointments.specialist_id = $1
         AND appointments.appointment_date = $2
         AND appointments.status = 'pending'`,
      [specialist_id, appointment_date]
    );

    // بررسی تداخل زمانی
    for (const appointment of existingAppointments.rows) {
      const existingTime = String(appointment.appointment_time);
      const parts = existingTime.split(':');

      const existingStart =
        Number(parts[0]) * 60 + Number(parts[1]);

      const existingEnd =
        existingStart + appointment.duration_minutes;

      if (
        newStart < existingEnd &&
        existingStart < newEnd
      ) {
        return res.status(409).json({
          success: false,
          message: 'این متخصص در این بازه زمانی نوبت دیگری دارد.'
        });
      }
    }
    // ثبت نوبت با شناسه کاربر احراز هویت شده
    const result = await pool.query(
      `INSERT INTO appointments
       (user_id, service_id, specialist_id, appointment_date, appointment_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user_id,
        service_id,
        specialist_id,
        appointment_date,
        appointment_time
      ]
    );

    res.status(201).json({
      success: true,
      message: 'نوبت با موفقیت ثبت شد.',
      appointment: result.rows[0]
    });

  } catch (error) {
    console.error('Appointment Error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'این متخصص در این ساعت قبلاً نوبت دارد.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ثبت نوبت.'
    });
  }
});

// نمایش نوبت‌های کاربر وارد شده
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         appointments.*,
         users.full_name,
         services.name AS service_name,
         specialists.full_name AS specialist_name,
         specialists.specialty AS specialist_specialty
       FROM appointments
       LEFT JOIN users
         ON appointments.user_id = users.id
       LEFT JOIN services
         ON appointments.service_id = services.id
       LEFT JOIN specialists
         ON appointments.specialist_id = specialists.id
       WHERE appointments.user_id = $1
       ORDER BY appointments.id DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      appointments: result.rows
    });

  } catch (error) {
    console.error('Get Appointments Error:', error);

    res.status(500).json({
      success: false,
      message: 'خطا در دریافت نوبت‌ها.'
    });
  }
});

// لغو نوبت توسط صاحب نوبت
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه نوبت معتبر نیست.'
      });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = $1
         AND user_id = $2
         AND status = 'pending'
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'نوبت پیدا نشد یا متعلق به شما نیست یا قبلاً لغو شده است.'
      });
    }

    res.json({
      success: true,
      message: 'نوبت با موفقیت لغو شد.',
      appointment: result.rows[0]
    });

  } catch (error) {
    console.error('Cancel Appointment Error:', error);

    res.status(500).json({
      success: false,
      message: 'خطا در لغو نوبت.'
    });
  }
});

module.exports = router;