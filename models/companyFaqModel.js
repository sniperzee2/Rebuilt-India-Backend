const mongoose = require('mongoose');

const companyfaqSchema = new mongoose.Schema({
	question: {
        type: String,
    },
    answer: {
        type: String,
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('companyfaq', companyfaqSchema)