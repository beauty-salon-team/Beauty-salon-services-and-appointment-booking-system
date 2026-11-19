const express = require('express');
const router = express.Router();

const {
  getAllServices,
  getServiceById
} = require('../services/serviceService');

// دریافت تمام خدمات
router.get('/', async (req, res) => {
  try {
    const services = await getAllServices();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت خدمات'
    });
  }
});

// دریافت یک خدمت بر اساس شناسه
router.get('/:id', async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت خدمت'
    });
  }
});

module.exports = router;