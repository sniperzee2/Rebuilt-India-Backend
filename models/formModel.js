const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    status:{
        type: String,
        default: 'pending'
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('form', formSchema)