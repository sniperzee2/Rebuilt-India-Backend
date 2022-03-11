const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
    subservice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subservice",
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

