const express = require("express");
const {
  register,
  login,
  me,
  userUpdate,
  sendOTP,
  verifyOtp,
} = require("../controllers/auth.controller");
const router = express.Router();
const { upload } = require("../middlewares/upload.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const validateUser = require("../middlewares/validateUser.js");

router.post("/send-otp", upload.single("profilePic"), validateUser, sendOTP);
router.post("/verify-otp", upload.single("profilePic"), verifyOtp);
router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.patch(
  "/user-update",
  authMiddleware,
  upload.single("newProfilePic"),
  userUpdate
);

module.exports = router;
