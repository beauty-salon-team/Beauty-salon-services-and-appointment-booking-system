const express = require('express');
const router = express.Router();

const {
    getAllSpecialists
} = require('../services/specialistService');

// دریافت فهرست متخصص‌های سالن
router.get('/', async (req, res) => {
    try {
        const specialists = await getAllSpecialists();

        res.status(200).json({
            success: true,
            count: specialists.length,
            data: specialists
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'خطا در دریافت فهرست متخصص‌ها.'
        });
    }
});

module.exports = router;