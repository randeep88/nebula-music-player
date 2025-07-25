const mongoose = require("mongoose");

const EmailVerificationSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 },
  expiresAt: Date,
});

const EmailVerification = mongoose.model(
  "EmailVerification",
  EmailVerificationSchema
);
module.exports = EmailVerification;
