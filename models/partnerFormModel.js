const mongoose = require('mongoose');

const partnerFormSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    review:{
        type:String
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('Partnerform',partnerFormSchema)