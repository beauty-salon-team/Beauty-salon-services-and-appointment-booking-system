// اعتبارسنجی اطلاعات ثبت‌نام
function validateRegister(req, res, next) {
    const { full_name, email, password } = req.body;

    if (!full_name || 
        !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'نام کامل، ایمیل و رمز عبور الزامی هستند.'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.'
        });
    }

    next();
}

// اعتبارسنجی اطلاعات ورود
function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'ایمیل و رمز عبور الزامی هستند.'
        });
    }

    next();
}

module.exports = {
    validateRegister,
    validateLogin
};