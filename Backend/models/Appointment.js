const pool = require('../config/db');

// بررسی وجود کاربر
async function findUserById(user_id) {
    const result = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [user_id]
    );

    return result.rows[0] || null;
}

// دریافت نوبت‌های فعال متخصص در یک تاریخ
async function getExistingAppointments(specialist_id, appointment_date) {
    const result = await pool.query(
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

    return result.rows;
}
// ثبت نوبت جدید
async function createAppointment(data) {
    const {
        user_id,
        service_id,
        specialist_id,
        appointment_date,
        appointment_time
    } = data;

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

    return result.rows[0];
}

// دریافت نوبت‌های یک کاربر
async function getUserAppointments(user_id) {
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
        [user_id]
    );

    return result.rows;
}

// لغو نوبت توسط صاحب نوبت
async function cancelAppointment(id, user_id) {
    const result = await pool.query(
        `UPDATE appointments
         SET status = 'cancelled'
         WHERE id = $1
            AND user_id = $2
            AND status = 'pending'
         RETURNING *`,
        [id, user_id]
    );

    return result.rows[0] || null;
}

module.exports = {
    findUserById,
    getExistingAppointments,
    createAppointment,
    getUserAppointments,
    cancelAppointment
};