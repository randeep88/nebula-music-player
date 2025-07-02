const Artist = require("../models/artist.model.js");
const Album = require("../models/album.model.js");
const Playlist = require("../models/playlist.model.js");

//Artist
const addArtist = async (req, res) => {
  try {
    const { artistId } = req.body;
    const userId = req.user.userId;

    const artist = await Artist.create({ artistId, user: userId });
    res.status(200).json(artist);
  } catch (error) {
    console.error("Error adding artist:", error);
    return res
      .status(500)
      .json({ message: "Failed to add artist", error: error.message });
  }
};

const removeArtist = async (req, res) => {
  try {
    const { artistId } = req.body;
    const userId = req.user.userId;

    const artist = await Artist.deleteOne({ artistId, user: userId });
    res.status(200).json(artist);
  } catch (error) {
    console.error("Error removing artist:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove artist", error: error.message });
  }
};

const getArtist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const artist = await Artist.find({ user: userId });
    res.status(200).json(artist);
  } catch (error) {
    console.error("Error getting artist:", error);
    return res
      .status(500)
      .json({ message: "Failed to get artist", error: error.message });
  }
};

//Album
const addAlbum = async (req, res) => {
  try {
    const { albumId } = req.body;
    const userId = req.user.userId;

    const existingAlbum = await Album.findOne({ albumId, user: userId });
    if (existingAlbum) {
      return res
        .status(200)
        .json({ message: "Album already exists in library" });
    }

    const album = await Album.create({ albumId, user: userId });
    return res.status(201).json({ message: "Album added successfully", album });
  } catch (error) {
    console.error("Error adding album:", error);
    return res
      .status(500)
      .json({ message: "Failed to add album", error: error.message });
  }
};

const removeAlbum = async (req, res) => {
  try {
    const { albumId } = req.body;
    const userId = req.user.userId;

    const deleted = await Album.deleteOne({ albumId, user: userId });
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error removing album:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove album", error: error.message });
  }
};

const getAlbum = async (req, res) => {
  try {
    const userId = req.user.userId;
    const album = await Album.find({ user: userId });
    res.status(200).json(album);
  } catch (error) {
    console.error("Error getting album:", error);
    return res
      .status(500)
      .json({ message: "Failed to get album", error: error.message });
  }
};

//Playlist
const addPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.user.userId;

    const playlist = await Playlist.create({ playlistId, user: userId });
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error adding playlist:", error);
    return res
      .status(500)
      .json({ message: "Failed to add playlist", error: error.message });
  }
};

const removePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.user.userId;

    const playlist = await Playlist.deleteOne({
      playlistId,
      user: userId,
    });
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error removing playlist:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove playlist", error: error.message });
  }
};

const getPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const playlist = await Playlist.find({ user: userId });
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error getting playlist:", error);
    return res
      .status(500)
      .json({ message: "Failed to get playlist", error: error.message });
  }
};

const getLibrary = async (req, res) => {
  const userId = req.user.userId;
  const playlists = await Playlist.find({ user: userId });
  const albums = await Album.find({ user: userId });
  const artists = await Artist.find({ user: userId });
  // console.log({ playlists, albums, artists });
  res.status(200).json({ playlists, albums, artists });
};

module.exports = {
  addArtist,
  removeArtist,
  getArtist,
  addAlbum,
  removeAlbum,
  getAlbum,
  addPlaylist,
  removePlaylist,
  getPlaylist,
  getLibrary,
};
