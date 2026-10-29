const express = require('express');
const cors = require('cors');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = 3000;

// Middleware ها
app.use(cors()); // اجازه ارتباط فرانت‌اند با بک‌اند
app.use(express.json()); // خواندن داده‌های JSON

// مسیر تست (Home Route)
app.get('/', (req, res) => {
  res.json({ message: "به API سالن زیبایی خوش آمدید!" });
});

// استفاده از مسیرهای مربوط به خدمات
app.use('/api/services', serviceRoutes);

// روشن کردن سرور
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
