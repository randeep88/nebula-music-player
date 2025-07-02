const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model.js");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
    if (user) console.log("User already exists");

    user = new User({ username, email, password, profilePic: req.file.path });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    console.log(isMatch);

    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      profilePic: user.profilePic,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const userUpdate = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("User ID:", userId);

    const { username, email, currentPassword, newPassword } = req.body;
    console.log("Request Body:", {
      username,
      email,
      currentPassword,
      newPassword,
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    console.log("Found User:", user);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Password does not match!" });
    console.log("Password Match:", isMatch);

    user.username = username || user.username;
    user.email = email || user.email;

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (req.file) {
      console.log("Received File:", req.file);
      user.profilePic = req.file.path;
    } else {
      console.log("No new profile picture uploaded or file not received");
    }

    await user.save();
    res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error("Error in userUpdate:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  login,
  register,
  me,
  userUpdate,
};
