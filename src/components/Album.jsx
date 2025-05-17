import { useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import { api } from "../utils/api";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { formatDuration } from "../utils/formatDuration";
import { Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePause,
  faCirclePlay,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../App.css";

const Album = () => {
  const {
    searchQuery,
    currentSong,
    isPlaying,
    isLoading,
    setSongs,
    songs,
    albums,
    artists,
    playlists,
    setAlbums,
    setArtists,
    setPlaylists,
    setIsLoading,
    setCurrentSong,
    setIsPlaying,
  } = usePlayerStore();
  return (
    <div className="p-5">
      {songs && songs.length > 0 ? (
        <div>
          {albums.length > 0 && (
            <div>
              <div className="grid grid-cols-6">
                {albums?.map((album, index) => (
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
                      <div className="flex flex-col items-start w-full">
                        <h1 className="font-semibold text-neutral-100 w-40 line-clamp-2">
                          {album.name}
                        </h1>
                        <p className="font-semibold text-neutral-400 text-sm">
                          {album.year} &bull;{" "}
                          {capitalizeFirstLetter(album.type)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Skeleton
          animation="wave"
          height={250}
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
  );
};

export default Album;
