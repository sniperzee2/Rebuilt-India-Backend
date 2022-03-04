const mongoose = require("mongoose");

const fullbookingSchema = new mongoose.Schema(
  {
    date:{
        type: String,
    },
    time:{
        type: String,
    },
    bookings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
    }],
    totalPrice:{
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fullbooking", fullbookingSchema);

