const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: 'Service name is required',
        max: 30,
        trim: true
    },

    service_description: {
        type: String,
        required: 'Service description is required',
        trim: true
    },

    service_icon: String,
    image: String,

    available: {
        type: Boolean,
        required: 'Availability is required'
    }
});

// Export model
module.exports = mongoose.model('Service', serviceSchema );