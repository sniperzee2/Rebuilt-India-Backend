const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
    subservice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subservice",
    },
    status:{
        type: String,
        default: "Open"
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    issues:[{
        type: String
    }],
    quantity:{
        type: Number,
        default: 1
    },
    technichianName:{
        type: String,
        default: "",
    },
    technichianNumber:{
        type: String,
        default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

