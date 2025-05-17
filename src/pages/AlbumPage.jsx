import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../utils/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePlayerStore } from "../store/usePlayerStore";
import { Skeleton, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import gif from "../assets/music1.gif";
import { formatDuration } from "../utils/formatDuration";
import "../App.css";
import ColorThief from "colorthief";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const AlbumPage = () => {
  const { albumId } = useParams();
  const {
    setAlbumDetails,
    setArtistDetails,
    albumDetails,
    artistDetails,
    isLoading,
    isPlaying,
    currentSong,
    setIsPlaying,
    setCurrentSong,
  } = usePlayerStore();
  const navigate = useNavigate();
  const [gradientColor, setGradientColor] = useState("#1e3264");
  const [error, setError] = useState(null);
  const imgRef = useRef(null);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    if (!albumId) {
      setError("Invalid album ID");
      return;
    }

    try {
      const albumRes = await api.get(`/albums?id=${albumId}`);
      if (!albumRes?.data?.data) {
        throw new Error("Invalid album data");
      }
      setAlbumDetails(albumRes.data.data);

      const artistId = albumRes.data.data?.artists?.primary?.[0]?.id;
      if (artistId) {
        const artistRes = await api.get(`/artists?id=${artistId}`);
        if (!artistRes?.data?.data) {
          throw new Error("Invalid artist data");
        }
        setArtistDetails(artistRes.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch album data:", err);
      setError("Failed to load album details. Please try again.");
    }
  }, [albumId, setAlbumDetails, setArtistDetails]);

  // Fetch album and artist data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract dominant color from image
  useEffect(() => {
    if (!albumDetails?.image?.[2]?.url || !imgRef.current) return;

    const colorThief = new ColorThief();
    const img = imgRef.current;

    const handleImageLoad = () => {
      try {
        const dominantColor = colorThief.getColor(img);
        setGradientColor(`rgb(${dominantColor.join(",")})`);
      } catch (err) {
        console.error("Error extracting color:", err);
        setGradientColor("#1e3264");
      }
    };

    img.crossOrigin = "Anonymous";
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener("load", handleImageLoad);
      return () => img.removeEventListener("load", handleImageLoad);
    }
  }, [albumDetails?.image]);

  // Handle song selection
  const handleSongClick = useCallback(
    (song) => {
      if (!song?.id) return;

      if (currentSong?.id === song.id && isPlaying) {
        setIsPlaying(false);
      } else {
        setCurrentSong(song);
        setIsPlaying(true);
      }
    },
    [currentSong?.id, isPlaying, setCurrentSong, setIsPlaying]
  );

  return (
    <div className="relative w-full overflow-auto scrollbar-container select-none bg-neutral-900">
      <div className="p-2 absolute bg-transparent">
        <Button
          variant="text"
          sx={{
            borderRadius: "9999px",
            textTransform: "none",
            minWidth: "unset",
            padding: 0,
            margin: 0,
            color: "white",
            backgroundColor: "rgba(42, 42, 42, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(42, 42, 42, 1)",
            },
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="w-4 h-4 p-2 transition-all rounded-full"
            onClick={() => navigate(-1)}
          />
        </Button>
      </div>

      <div
        className="flex items-center gap-5 w-full p-5 pt-7"
        style={{
          background: `linear-gradient(to bottom, ${gradientColor}, #171717)`,
          minHeight: "300px",
        }}
      >
        <div>
          {albumDetails?.image?.[2]?.url ? (
            <img
              ref={imgRef}
              src={albumDetails.image[2].url}
              className="w-52 rounded"
              alt={albumDetails?.name || "Album"}
              loading="lazy"
            />
          ) : (
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={208}
              height={208}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
          )}
        </div>
        <div className="space-y-2">
          {!isLoading ? (
            <h1 className="text-neutral-100 font-semibold">
              {capitalizeFirstLetter(albumDetails?.type || "")}
            </h1>
          ) : (
            <Skeleton
              animation="wave"
              height={60}
              width={600}
              className="rounded"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
          )}
          {!isLoading ? (
            <h1 className="text-neutral-100 text-8xl font-[900] line-clamp-2 w-[60vw]">
              {albumDetails?.name || ""}
            </h1>
          ) : (
            <Skeleton
              animation="wave"
              height={60}
              width={600}
              className="rounded"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
          )}
          {!isLoading ? (
            <p className="text-neutral-100 font-semibold">
              {albumDetails?.description || ""} • {albumDetails?.songCount || 0}{" "}
              songs
            </p>
          ) : (
            <Skeleton
              animation="wave"
              height={60}
              width={600}
              className="rounded"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
          )}
        </div>
      </div>

      <div className=""></div>

      <div className="bg-neutral-900">
        <div className="flex sticky top-0 mb-5 z-20 items-center gap-3 bg-neutral-900 text-neutral-400 font-semibold border-b border-neutral-700 mx-5 p-2 transition-colors duration-300">
          <div className="text-center text-lg w-14">#</div>
          <div className="w-full text-sm">Title</div>
          <div className="w-2/12 text-center text-sm">Duration</div>
        </div>
        {!isLoading && albumDetails?.songs?.length > 0 ? (
          <div className="px-5">
            {albumDetails.songs.map((song, index) => (
              <div
                key={song?.id || index}
                className="flex items-center rounded gap-3 p-2 hover:bg-neutral-800 bg-opacity-20 transition-all group"
                onClick={() => handleSongClick(song)}
              >
                <div className="font-semibold w-14 h-10 flex items-center group-hover:invisible justify-center text-neutral-400 relative cursor-pointer">
                  {currentSong?.id === song?.id && isPlaying ? (
                    <img src={gif} className="w-6" alt="Playing" />
                  ) : (
                    <div>{index + 1}</div>
                  )}
                  <FontAwesomeIcon
                    icon={
                      currentSong?.id === song?.id && isPlaying
                        ? faPause
                        : faPlay
                    }
                    className="text-white text-lg absolute group-hover:visible invisible"
                  />
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div>
                    <img
                      src={song?.image?.[2]?.url || ""}
                      className="rounded w-10"
                      alt={song?.name || "Song"}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h1 className="text-neutral-100 font-semibold truncate overflow-hidden">
                      {song?.name || "Unknown Song"}
                    </h1>
                    <p className="text-neutral-400 group-hover:text-neutral-100 text-sm font-semibold truncate overflow-hidden">
                      {song?.artists?.primary?.[0]?.name || "Unknown Artist"}
                    </p>
                  </div>
                </div>
                <div className="w-2/12 group-hover:text-neutral-100 text-center text-sm text-neutral-400 font-semibold">
                  {formatDuration(song?.duration || 0)}
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className="px-5">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                height={60}
                className="rounded"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  "&::after": {
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                  },
                }}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 text-neutral-400">
            No songs available in this album.
          </div>
        )}
      </div>

      {artistDetails?.topAlbums?.length > 0 && (
        <div className="py-16 px-5 bg-neutral-900">
          <h1 className="font-[800] text-neutral-100 text-2xl mb-3 px-3">
            More by {artistDetails?.name || "Artist"}
          </h1>
          <div className="grid grid-cols-6">
            {artistDetails.topAlbums.slice(0, 6).map((album) => (
              <Link to={`/album/${album?.id}`} key={album?.id || album?.name}>
                <div className="cursor-pointer transition-all hover:bg-neutral-800 p-3 rounded w-full flex flex-col items-center h-full">
                  <div>
                    {album?.image?.[2]?.url ? (
                      <img
                        src={album.image[2].url}
                        className="w-40 rounded-md mb-3"
                        alt={album?.name || "Album"}
                        loading="lazy"
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width={160}
                        height={160}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          "&::after": {
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                          },
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h1 className="font-semibold text-neutral-100 line-clamp-2 w-40">
                      {album?.name || "Unknown Album"}
                    </h1>
                    <p className="font-semibold text-neutral-400 line-clamp-2 w-40 text-sm">
                      {album?.year || "Unknown Year"} •{" "}
                      {capitalizeFirstLetter(album?.type || "")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumPage;
