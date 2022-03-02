const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({   
    image:{
        type: String
    },
    description:{
        type: String
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('Process', processSchema)