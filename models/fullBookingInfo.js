const mongoose = require("mongoose");

const fullbookingSchema = new mongoose.Schema(
  {
    Date:{
        type: Date,
        default: Date.now
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

