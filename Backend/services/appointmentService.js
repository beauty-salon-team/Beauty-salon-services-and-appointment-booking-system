const pool = require('../db');

// بررسی وجود متخصص و خدمت و تطابق تخصص
async function checkAppointmentData(service_id, specialist_id) {
    const specialistResult = await pool.query(
        'SELECT id, specialty FROM specialists WHERE id = $1',
        [specialist_id]
    );

    if (specialistResult.rows.length === 0) {
        return {
            error: 'متخصص مورد نظر پیدا نشد.',
            status: 404
        };
    }

    const serviceResult = await pool.query(
        'SELECT id, name, duration_minutes FROM services WHERE id = $1',
        [service_id]
    );

    if (serviceResult.rows.length === 0) {
        return {
            error: 'خدمت انتخاب شده پیدا نشد.',
            status: 404
        };
    }

    if (specialistResult.rows[0].specialty !== serviceResult.rows[0].name) {
        return {
            error: 'این متخصص خدمت انتخاب شده را ارائه نمی‌دهد.',
            status: 400
        };
    }

    return {
        service: serviceResult.rows[0],
        specialist: specialistResult.rows[0]
    };
}

module.exports = { checkAppointmentData };