const Appointment = require('../models/Appointment');
const { checkAppointmentData } = require('../services/appointmentService');

// ثبت رزرو نوبت
async function createAppointment(req, res) {
    try {
        const {
            service_id,
            specialist_id,
            appointment_date,
            appointment_time
        } = req.body;

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
        const user = await Appointment.findUserById(user_id);

        if (!user) {
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
        const duration = appointmentData.service.duration_minutes;

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
        const existingAppointments = await Appointment.getExistingAppointments(
            specialist_id,
            appointment_date
        );

        // بررسی تداخل زمانی
        for (const appointment of existingAppointments) {
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
        // ثبت نوبت
        const newAppointment = await Appointment.createAppointment({
            user_id,
            service_id,
            specialist_id,
            appointment_date,
            appointment_time
        });

        res.status(201).json({
            success: true,
            message: 'نوبت با موفقیت ثبت شد.',
            appointment: newAppointment
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
}

// نمایش نوبت‌های کاربر وارد شده
async function getUserAppointments(req, res) {
    try {
        const appointments = await Appointment.getUserAppointments(
            req.user.id
        );

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });

    } catch (error) {
        console.error('Get Appointments Error:', error);

        res.status(500).json({
            success: false,
            message: 'خطا در دریافت نوبت‌ها.'
        });
    }
}

// لغو نوبت توسط صاحب نوبت
async function cancelAppointment(req, res) {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'شناسه نوبت معتبر نیست.'
            });
        }

        const appointment = await Appointment.cancelAppointment(
            id,
            req.user.id
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'نوبت پیدا نشد یا متعلق به شما نیست یا قبلاً لغو شده است.'
            });
        }

        res.json({
            success: true,
            message: 'نوبت با موفقیت لغو شد.',
            appointment
        });

    } catch (error) {
        console.error('Cancel Appointment Error:', error);

        res.status(500).json({
            success: false,
            message: 'خطا در لغو نوبت.'
        });
    }
}

module.exports = {
    createAppointment,
    getUserAppointments,
    cancelAppointment
};