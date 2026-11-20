const {
    getAllServices,
    getServiceById
} = require('../services/serviceService');

// دریافت تمام خدمات
async function getAllServicesController(req, res) {
    try {
        const services = await getAllServices();

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error('Error fetching services:', error);

        res.status(500).json({
            success: false,
            message: 'خطا در دریافت خدمات'
        });
    }
}

// دریافت یک خدمت بر اساس شناسه
async function getServiceByIdController(req, res) {
    try {
        const id = req.params.id;
        const service = await getServiceById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'خدمت مورد نظر پیدا نشد'
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error fetching service:', error);

        res.status(500).json({
            success: false,
            message: 'خطا در دریافت خدمت'
        });
    }
}

module.exports = {
    getAllServicesController,
    getServiceByIdController
};