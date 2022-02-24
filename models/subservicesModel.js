const mongoose = require('mongoose');

const subserviceSchema = new mongoose.Schema({   
    name: {
        type: String,
    },
    mainDescription: {
        type: String,
    },
    points:[{
        type: String,
    }],
    image:{
        type: String,
    },
    discount:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        default: 0
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('Subservice', subserviceSchema)