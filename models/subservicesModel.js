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
    headerImg:{
        type: String,
    },
    discount:{
        type: Number,
        default: 0
    },
    price:{
        type: String,
    },
    categories:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    process:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Process'
    }],
    issues:[{
        type: String
    }]
}, {
  timestamps: true
});


module.exports = mongoose.model('Subservice', subserviceSchema)