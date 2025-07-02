const express = require("express");
const {
  register,
  login,
  me,
  userUpdate,
} = require("../controllers/auth.controller");
const router = express.Router();
const { upload } = require("../middlewares/upload.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

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
