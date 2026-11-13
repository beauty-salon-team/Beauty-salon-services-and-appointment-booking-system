const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// تنظیمات اصلی سرور
app.use(cors());
app.use(express.json());

// اتصال مسیرها
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const specialistRoutes = require('./routes/specialistRoutes');

// مسیر اصلی
app.get('/', (req, res) => {
    res.json({
        message: 'به سیستم رزرو نوبت سالن زیبایی خوش آمدید.'
    });
});

// مسیرهای API
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/specialists', specialistRoutes);

// اجرای سرور
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});