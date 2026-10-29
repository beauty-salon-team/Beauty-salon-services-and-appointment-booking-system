const express = require('express');

const router = express.Router();

// لیست خدمات سالن زیبایی
const services = [
  {
    id: 1,
    name: 'اصلاح و کوتاهی مو',
    description: 'کوتاهی و مرتب کردن مو',
    price: 250000
  },
  {
    id: 2,
    name: 'رنگ مو',
    description: 'رنگ کردن مو با توجه به درخواست مشتری',
    price: 800000
  },
  {
    id: 3,
    name: 'مانیکور',
    description: 'مراقبت و زیبایی ناخن‌های دست',
    price: 300000
  },
  {
    id: 4,
    name: 'پاکسازی پوست',
    description: 'پاکسازی و مراقبت از پوست صورت',
    price: 500000
  }
];

// دریافت فهرست تمام خدمات
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// دریافت اطلاعات یک خدمت بر اساس شناسه
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  const service = services.find(item => item.id === id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'خدمت موردنظر پیدا نشد.'
    });
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

module.exports = router;
