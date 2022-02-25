const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({   
    name: {
        type: String,
    },
    points:[{
        description:{
            type: String,
        },
        price:{
            type: String
        }
    }]
}, {
  timestamps: true
});


module.exports = mongoose.model('Rate', rateSchema)