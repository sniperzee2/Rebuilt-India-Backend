const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator")

const adminSchema = new mongoose.Schema(
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
    address: {
      type: String,
    },
    role:{
        type: String,
        default: "admin"
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.password) next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  adminPassword
) {
  return await bcrypt.compare(candidatePassword, adminPassword);
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model("Admin", adminSchema);

