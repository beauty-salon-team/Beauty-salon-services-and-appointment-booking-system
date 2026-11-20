const pool = require('../config/db');

// ایجاد کاربر جدید
async function createUser(full_name, email, password_hash, phone) {
    const result = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, phone)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, email, phone`,
        [full_name, email, password_hash, phone || null]
    );

    return result.rows[0];
}

// یافتن کاربر بر اساس ایمیل
async function findUserByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    return result.rows[0] || null;
}

module.exports = {
    createUser,
    findUserByEmail
};