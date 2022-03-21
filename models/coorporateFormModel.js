const mongoose = require('mongoose');

const coorporateFormSchema = new mongoose.Schema({
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
    company:{
        type:String
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('Coorporateform',coorporateFormSchema)