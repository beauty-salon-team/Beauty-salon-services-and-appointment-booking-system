const pool = require('../config/db');

// دریافت تمام خدمات
async function getAllServices() {
    const result = await pool.query(
        'SELECT * FROM services ORDER BY id'
    );

    return result.rows;
}

// دریافت یک خدمت بر اساس شناسه
async function getServiceById(id) {
    const result = await pool.query(
        'SELECT * FROM services WHERE id = $1',
        [id]
    );

    return result.rows[0] || null;
}

module.exports = {
    getAllServices,
    getServiceById
};