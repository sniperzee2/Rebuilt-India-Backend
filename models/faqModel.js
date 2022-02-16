const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
	question: {
        type: String,
    },
    answer: {
        type: String,
    },
    icon:{
        type: String,
    }

}, {
  timestamps: true
});


module.exports = mongoose.model('faq', faqSchema)