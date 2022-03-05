const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      validator: [validator.isEmail, "Please provide a valid email"],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please provide a phone number"],
    },
    address: {
      type: String,
    },
    city:{
      type: String,
    },
    zipcode:{
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    history:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.password) next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model("User", userSchema);

