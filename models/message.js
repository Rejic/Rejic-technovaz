const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: 'first is required',
        trim: true,
        max: 30
    },

    surname: {
        type: String,
        required: 'first is required',
        trim: true,
        max: 30
    },

    message: {
        type: String,
        required: 'message is required',
        trim: true
    }
});

//model exports
module.exports = mongoose.model('Message', messageSchema );
