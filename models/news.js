const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    news_name: {
        type: String,
        required: 'News name is required',
        trim: true,
        max: 30
    },

    news_description: {
        type: String,
        required: 'News description is required',
        trim: true
    },
    news_image: String,

    news_category: {
        type: String,
        required:'News category is required',
        trim: true
    },
    date_posted: Date,

    available: {
        type: Boolean,
        required: 'Availability is required'
    }
});

// model exports
module.exports = mongoose.model('News', newsSchema);