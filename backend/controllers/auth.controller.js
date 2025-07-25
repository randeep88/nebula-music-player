const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model.js");
const EmailVerification = require("../models/EmailVerification.model.js");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "randeeprajpal9@gmail.com",
    pass: "vyhu iwmi yhxk gecn",
  },
});

const register = async (req, res) => {
  try {
    const { username, email } = req.body;
    console.log(username, email);

    const newUser = await User.create({
      username,
      email,
      profilePic: req.file.path,
    });

    console.log("newUser", newUser);

    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    res.json({ token, user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Getting error in user registeration", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user.isVerified)
      return res.status(400).json({ msg: "User not verified" });

    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const userUpdate = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { username, email } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;

    if (req.file) {
      user.profilePic = req.file.path;
    }

    await user.save();
    res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await EmailVerification.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true }
  );

  try {
    await transporter.sendMail({
      from: "Nebula <randeeprajpal9@gmail.com>",
      to: email,
      subject: "Email Verification OTP for Nebula",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: `OTP sent to ${email}`, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    console.log(otp, email);

    const verifiedOTP = await EmailVerification.findOne({ otp, email });
    if (!verifiedOTP) return res.status(400).json({ msg: "Invalid OTP" });

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    console.log("updatedUser", updatedUser);

    res.json({
      message: "User verified successfully!",
      success: true,
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  login,
  register,
  me,
  userUpdate,
  sendOTP,
  verifyOtp,
};
