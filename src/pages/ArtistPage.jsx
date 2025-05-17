import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/api";
import { usePlayerStore } from "../store/usePlayerStore";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import gif from "../assets/music1.gif";
import { formatDuration } from "../utils/formatDuration";
import "../App.css";
import { Button } from "@mui/material";
import ColorThief from "colorthief";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const fetchAll = async (
  artistId,
  setArtistDetails,
  setArtistSongs,
  setArtistAlbums,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const [artSongs, artAlbums, artDetails] = await Promise.all([
      api.get(`/artists/${artistId}/songs`),
      api.get(`/artists/${artistId}/albums`),
      api.get(`/artists/${artistId}`),
    ]);
    setArtistDetails(artDetails.data.data);
    setArtistSongs(artSongs.data.data.songs);
    setArtistAlbums(artAlbums.data.data.albums);
  } catch (error) {
    console.error("Error fetching data", error);
  } finally {
    setIsLoading(false);
  }
};

const ArtistPage = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const {
    setArtistSongs,
    setArtistAlbums,
    setIsLoading,
    artistDetails,
    setArtistDetails,
    isLoading,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
  } = usePlayerStore();

  // console.log("songs", artistSongs);
  // console.log("albums", artistAlbums);
  console.log("artist", artistDetails);

  useEffect(() => {
    if (artistId) {
      fetchAll(
        artistId,
        setArtistDetails,
        setArtistSongs,
        setArtistAlbums,
        setIsLoading
      );
    }
  }, [artistId]);

  const [gradientColor, setGradientColor] = useState("");
  const imgRef = useRef(null);

  useEffect(() => {
    if (artistDetails?.image?.[2]?.url && imgRef.current) {
      const colorThief = new ColorThief();
      const img = imgRef.current;

      img.crossOrigin = "Anonymous"; // Ensure CORS is handled if the image is from a different domain
      img.onload = () => {
        try {
          const dominantColor = colorThief.getColor(img);
          const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
          setGradientColor(rgbColor);
        } catch (error) {
          console.error("Error extracting color:", error);
          setGradientColor("#1e3264"); // Fallback color
        }
      };
    }
  }, [artistDetails]);

  return (
    <div className="relative w-full overflow-auto scrollbar-container select-none">
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
            className=" w-4 h-4 p-2 transition-all rounded-full"
            onClick={() => navigate(-1)}
          />
        </Button>
      </div>

      <div
        className="flex items-center gap-5 w-full p-5"
        style={{
          background: `linear-gradient(to bottom, ${gradientColor}, #171717)`,
          minHeight: "300px",
        }}
      >
        <div>
          {artistDetails?.image?.[2]?.url ? (
            <img
              ref={imgRef}
              src={artistDetails.image[2].url}
              className="w-52 rounded-full"
              alt={artistDetails.name || "Artist"}
            />
          ) : (
            <Skeleton
              variant="circular"
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
        {!isLoading ? (
          <div className="space-y-2">
            {artistDetails.isVerified && (
              <div className="flex items-center gap-2">
                <VerifiedIcon className="text-blue-400" />
                <p className="text-neutral-100 font-semibold">
                  Verified Artist
                </p>
              </div>
            )}
            <h1 className="text-neutral-100 text-8xl font-[900]">
              {artistDetails?.name}
            </h1>
            <p className="text-neutral-100 font-semibold">
              {artistDetails?.followerCount} followers
            </p>
          </div>
        ) : (
          <div className="w-[600px]">
            <Skeleton
              animation="wave"
              height={30}
              width={200}
              className="rounded"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
            <Skeleton
              animation="wave"
              height={90}
              className="rounded"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
            <Skeleton
              animation="wave"
              height={30}
              width={200}
              className="rounded"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                },
              }}
            />
          </div>
        )}
      </div>

      {/* songs */}
      <div className="bg-neutral-900">
        {artistDetails?.topSongs?.length > 0 ? (
          <h1 className="font-[800] text-neutral-100 text-2xl mb-3 px-5">
            Top Songs
          </h1>
        ) : (
          <Skeleton
            animation="wave"
            height={30}
            width={200}
            className="rounded mx-5"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              "&::after": {
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
              },
            }}
          />
        )}
        {!isLoading && artistDetails?.topSongs?.length > 0 ? (
          <div>
            <div className="px-5">
              {artistDetails.topSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center rounded gap-3 p-2 hover:bg-neutral-800 bg-opacity-20 transition-all group"
                >
                  <div className="font-semibold w-14 h-10 flex items-center group-hover:invisible justify-center text-neutral-400 relative cursor-pointer">
                    {currentSong?.id === song?.id && isPlaying ? (
                      <div>
                        <img src={gif} className="w-6" />
                      </div>
                    ) : (
                      <div>{index + 1}</div>
                    )}
                    {currentSong?.id === song?.id && isPlaying ? (
                      <FontAwesomeIcon
                        icon={faPause}
                        className="text-white text-lg absolute group-hover:visible invisible"
                        onClick={() => setIsPlaying(false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-white text-lg absolute group-hover:visible invisible"
                        onClick={() => {
                          setCurrentSong(song);
                          setIsPlaying(true);
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-2/3 ">
                    <div>
                      <img src={song.image[2].url} className="rounded w-10" />
                    </div>
                    <div>
                      <h1 className="text-neutral-100 font-semibold truncate overflow-hidden">
                        {song.name}
                      </h1>
                      <p className="text-neutral-400 group-hover:text-neutral-100 text-sm font-semibold truncate overflow-hidden">
                        {song.artists.primary[0].name}
                      </p>
                    </div>
                  </div>
                  <div className="w-2/4 group-hover:text-neutral-100 text-center text-sm text-neutral-400 font-semibold truncate overflow-hidden ">
                    {song.album.name}
                  </div>
                  <div className="w-2/12 group-hover:text-neutral-100 text-center text-sm text-neutral-400 font-semibold ">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-5">
            <Skeleton
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
            <Skeleton
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
            <Skeleton
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
          </div>
        )}
      </div>

      {/* albums */}
      <div className="mt-10 px-5">
        <h1 className="font-[800] text-neutral-100 text-2xl mb-3 px-3">
          Albums
        </h1>
        <div className="grid grid-cols-6 ">
          {artistDetails?.topAlbums?.slice(0, 6).map((album, index) => (
            <Link to={`/album/${album.id}`} key={index}>
              <div className="cursor-pointer transition-all hover:bg-neutral-800 p-3 rounded w-full flex flex-col items-center h-full">
                <div>
                  {album?.image?.[2]?.url ? (
                    <img
                      src={album.image[2].url}
                      className="w-40 rounded-md mb-3"
                    />
                  ) : (
                    <Skeleton
                      variant="circular"
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
                <div>
                  <h1 className="font-semibold text-neutral-100  line-clamp-2 w-40">
                    {album.name}
                  </h1>
                  <p className="font-semibold text-neutral-400 text-sm line-clamp-2 w-40">
                    {album.year} &bull; {capitalizeFirstLetter(album.type)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* singles */}
      <div className="my-10 px-5">
        <h1 className="font-[800] text-neutral-100 text-2xl mb-3 px-3">
          Singles
        </h1>
        <div className="grid grid-cols-6 ">
          {artistDetails?.singles?.slice(0, 6).map((album, index) => (
            <Link to={`/album/${album.id}`} key={index}>
              <div className="cursor-pointer transition-all hover:bg-neutral-800 p-3 rounded w-full flex flex-col items-center h-full">
                <div>
                  {album?.image?.[2]?.url ? (
                    <img
                      src={album.image[2].url}
                      className="w-40 rounded-md mb-3"
                    />
                  ) : (
                    <Skeleton
                      variant="circular"
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
                <div>
                  <h1 className="font-semibold text-neutral-100 line-clamp-2 w-40">
                    {album.name}
                  </h1>
                  <p className="font-semibold text-neutral-400 text-sm">
                    {album.year} &bull; {capitalizeFirstLetter(album.type)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
