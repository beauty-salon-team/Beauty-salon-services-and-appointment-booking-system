const pool = require('../config/db');

// دریافت فهرست متخصص‌های سالن
async function getAllSpecialists() {
    const result = await pool.query(
        'SELECT * FROM specialists ORDER BY id'
    );

    return result.rows;
}

module.exports = {
    getAllSpecialists
};