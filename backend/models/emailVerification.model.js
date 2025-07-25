const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 },
  expiresAt: Date,
});

const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
module.exports = EmailVerification;
