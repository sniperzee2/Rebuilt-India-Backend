const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    review:{
        type:String
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('Contactform',contactFormSchema)