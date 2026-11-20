const Specialist = require('../models/Specialist');

// دریافت فهرست متخصص‌های سالن
async function getAllSpecialists() {
    return Specialist.getAllSpecialists();
}

module.exports = {
    getAllSpecialists
};