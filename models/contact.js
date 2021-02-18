const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Names are rrequired',
        max: 30
    },
    email: {
        type: String,
        trim: true,
        required: 'Email is required',
        unique: true,
        lowercase: true
    },
    subject: {
         type: String,
         required: 'Subject is required',
         trim: true
    },
    phone: {
        type: Number,
        required: 'Phone number is required'
    },
    message: {
        type: String,
        trim: true,
        required: 'Message is required'
    }
});

//module exports
module.exports = mongoose.model('Contact',contactSchema );