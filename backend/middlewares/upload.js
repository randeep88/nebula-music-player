const { storage } = require("../config/cloudinary.js");
const multer = require("multer");
const upload = multer({ storage });

module.exports = { upload };
