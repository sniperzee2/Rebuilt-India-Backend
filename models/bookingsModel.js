const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
    subService:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subservice",
    },
    status:{
        type: String,
    },
    quantity:{
        type: Number,
        default: 1
    },
    priceToPay:{
        type: Number,
        default: 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

