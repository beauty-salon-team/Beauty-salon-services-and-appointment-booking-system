const express = require('express');
const router = express.Router();

const {
    getAllServicesController,
    getServiceByIdController
} = require('../controllers/serviceController');

// دریافت تمام خدمات
router.get('/', getAllServicesController);

// دریافت یک خدمت بر اساس شناسه
router.get('/:id', getServiceByIdController);

module.exports = router;