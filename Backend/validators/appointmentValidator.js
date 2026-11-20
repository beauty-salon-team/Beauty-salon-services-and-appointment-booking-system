// اعتبارسنجی اطلاعات ثبت نوبت
function validateAppointment(req, res, next) {
    const {
        service_id,
        specialist_id,
        appointment_date,
        appointment_time
    } = req.body;

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
        !Number.isInteger(Number(service_id)) ||
        Number(service_id) <= 0 ||
        !Number.isInteger(Number(specialist_id)) ||
        Number(specialist_id) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'شناسه خدمت و متخصص معتبر نیستند.'
        });
    }

    // بررسی فرمت تاریخ
    const selectedDate = new Date(appointment_date);

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date) ||
        isNaN(selectedDate.getTime()) ||
        selectedDate.toISOString().slice(0, 10) !== appointment_date
    ) {
        return res.status(400).json({
            success: false,
            message: 'تاریخ وارد شده معتبر نیست.'
        });
    }

    // جلوگیری از رزرو تاریخ گذشته
    const today = new Date();

    selectedDate.setUTCHours(0, 0, 0, 0);
    today.setUTCHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return res.status(400).json({
            success: false,
            message: 'امکان رزرو نوبت در تاریخ گذشته وجود ندارد.'
        });
    }

    // بررسی فرمت ساعت
    if (
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(
            String(appointment_time)
        )
    ) {
        return res.status(400).json({
            success: false,
            message: 'فرمت ساعت وارد شده معتبر نیست.'
        });
    }

    next();
}

module.exports = {
    validateAppointment
};