const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ثبت‌نام کاربر
async function registerUser(full_name, email, password, phone) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return User.createUser(
        full_name,
        email.toLowerCase().trim(),
        hashedPassword,
        phone
    );
}

// ورود کاربر
async function loginUser(email, password) {
    const user = await User.findUserByEmail(
        email.toLowerCase().trim()
    );

    if (!user) {
        return null;
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!validPassword) {
        return null;
    }

    const { password_hash, ...safeUser } = user;

    const token = jwt.sign(
        {
            id: safeUser.id,
            email: safeUser.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { user: safeUser, token };
}

module.exports = {
    registerUser,
    loginUser
};