const {
    getAllSpecialists
} = require('../services/specialistService');

// دریافت تمام متخصصان
async function getAllSpecialistsController(req, res) {
    try {
        const specialists = await getAllSpecialists();

        res.status(200).json({
            success: true,
            count: specialists.length,
            data: specialists
        });
    } catch (error) {
        console.error('Error fetching specialists:', error);

        res.status(500).json({
            success: false,
            message: 'خطا در دریافت متخصصان'
        });
    }
}

module.exports = {
    getAllSpecialistsController
};