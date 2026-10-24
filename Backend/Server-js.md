const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware ها
app.use(cors()); // اجازه دادن به فرانت‌اند برای ارتباط با بک‌اند
app.use(express.json()); // برای خواندن داده‌های JSON از درخواست‌ها

// یک مسیر تست ساده (Home Route)
app.get('/', (req, res) => {
  res.json({ message: "به API سالن زیبایی خوش آمدید!" });
});

// مسیر دریافت لیست خدمات (داده‌های تستی فعلی)
app.get('/api/services', (req, res) => {
  const services = [
    { id: 1, name: "کوتاهی مو", price: 150000 },
    { id: 2, name: "رنگ مو", price: 500000 },
    { id: 3, name: "مانیکور", price: 200000 }
  ];
  res.json(services);
});

// روشن کردن سرور
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
