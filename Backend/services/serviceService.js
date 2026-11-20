const Service = require('../models/Service');

// دریافت تمام خدمات
async function getAllServices() {
    return Service.getAllServices();
}

// دریافت یک خدمت بر اساس شناسه
async function getServiceById(id) {
    return Service.getServiceById(id);
}

module.exports = {
    getAllServices,
    getServiceById
};