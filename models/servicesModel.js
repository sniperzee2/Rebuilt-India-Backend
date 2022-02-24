const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true,
    },
    image:{
        type: String,
    },
    description: {
        type: String,
    },
    subServices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subservice'
    }],
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    faqs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faq'
    }],
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }]

}, {
  timestamps: true
});


module.exports = mongoose.model('Service', serviceSchema)