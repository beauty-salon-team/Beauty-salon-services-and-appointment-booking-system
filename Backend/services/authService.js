const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// ثبت‌نام کاربر
async function registerUser(full_name, email, password, phone) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, phone)
         VALUES ($1, $2, $3, $4)
         RETURNING id, full_name, email, phone`,
        [full_name, email.toLowerCase().trim(), hashedPassword, phone || null]
    );

    return result.rows[0];
}

// ورود کاربر
async function loginUser(email, password) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
        return null;
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

    return { user, token };
}

module.exports = { registerUser, loginUser };