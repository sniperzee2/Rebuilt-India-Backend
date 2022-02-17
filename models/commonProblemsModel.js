const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
	question: {
        type: String,
    },
    answer: {
        type: String,
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('problem', problemSchema)