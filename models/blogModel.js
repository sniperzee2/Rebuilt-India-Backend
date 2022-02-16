const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	title:{
        type: String,
    },
    details:{
        type: String,
    },
    author:{
        type: String,
    },
    image:{
        type: String,
    },
    date:{
        type: String,
    }

}, {
  timestamps: true
});


module.exports = mongoose.model('blog', blogSchema)