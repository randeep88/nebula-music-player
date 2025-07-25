const User = require("../models/user.model.js");

const validateUser = async (req, res, next) => {
  if (req.body.purpose === "login") {
    next();
  } else {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email not found" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    next();
  }
};

module.exports = validateUser;
