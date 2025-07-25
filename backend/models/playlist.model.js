const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  playlistId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
