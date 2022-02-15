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
        ref: 'subservice'
    }],
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    }],
    faqs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faq'
    }]

}, {
  timestamps: true
});


module.exports = mongoose.model('service', serviceSchema)