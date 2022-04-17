const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    serviceID:{
        type: String,
    },
    city:{
        type: String,
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('Seo', seoSchema)