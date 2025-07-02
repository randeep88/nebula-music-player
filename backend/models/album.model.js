const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Album", albumSchema);
