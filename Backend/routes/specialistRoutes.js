const express = require('express');
const router = express.Router();

const {
    getAllSpecialistsController
} = require('../controllers/specialistController');

// دریافت فهرست متخصص‌های سالن
router.get('/', getAllSpecialistsController);

module.exports = router;