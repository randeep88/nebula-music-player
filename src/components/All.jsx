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

const fetchAll = async (
  searchQuery,
  setSongs,
  setAlbums,
  setArtists,
  setPlaylists,
  setLoading
) => {
  setLoading(true);
  try {
    const [songsRes, albumsRes, playlistsRes] = await Promise.all([
      api.get(`/search/songs?query=${searchQuery}&limit=50`),
      api.get(`/search/albums?query=${searchQuery}&limit=50`),
      api.get(`/search/playlists?query=${searchQuery}&limit=50`),
    ]);

    const songs = songsRes.data.data.results;
    setSongs(songs);
    setAlbums(albumsRes.data.data.results);
    setPlaylists(playlistsRes.data.data.results);

    if (songs.length > 0) {
      const artistId = songs[0]?.artists?.primary[0]?.id;
      if (artistId) {
        const artistsRes = await api.get(`/artists?id=${artistId}`);
        setArtists(artistsRes.data.data);
      }
    }
  } catch (error) {
    console.error("Error fetching data", error);
  } finally {
    setLoading(false);
  }
};

const All = () => {
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

  useEffect(() => {
    if (searchQuery) {
      fetchAll(
        searchQuery,
        setSongs,
        setAlbums,
        setArtists,
        setPlaylists,
        setIsLoading
      );
    }
  }, [searchQuery]);

  console.log("songs", songs);
  console.log("artists", artists);
  console.log("playlists", playlists);

  return (
    <div className="p-5 bg-neutral-900">
      <div className="flex items-center gap-3 mt-8">
        {/* top result */}
        <div className="w-[450px]">
          {songs && songs.length > 0 ? (
            <h1 className="font-[800] text-neutral-100 text-2xl mb-1">
              Top result
            </h1>
          ) : (
            <Skeleton
              animation="wave"
              height={30}
              width={100}
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
          {songs && songs.length > 0 ? (
            <div className="group relative bg-neutral-800 bg-opacity-40 hover:bg-opacity-100 transition-all p-5 rounded-lg flex flex-col items-start gap-4">
              <div>
                <img
                  src={songs[0].image[2].url}
                  className="w-28 rounded"
                  alt="Song cover"
                />
              </div>
              <div>
                <h1 className="font-bold text-neutral-100 text-4xl truncate w-96">
                  {songs[0].name}
                </h1>
                <div className="font-semibold text-neutral-100">
                  <span className="text-neutral-400">
                    {capitalizeFirstLetter(songs[0].type)} •
                  </span>{" "}
                  <span>{songs[0].artists.primary[0].name}</span>
                </div>
              </div>
              <div>
                {currentSong?.id === songs[0]?.id && isPlaying ? (
                  <FontAwesomeIcon
                    icon={faCirclePause}
                    className="text-5xl text-[#F0F8FF] shadow-2xl active:scale-95 transition-all duration-200 absolute bottom-5 right-5"
                    onClick={() => setIsPlaying(false)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    className="text-5xl text-[#F0F8FF] shadow-2xl active:scale-95 transition-all duration-200 group-hover:bottom-5 opacity-0 group-hover:opacity-100 absolute bottom-0 right-5"
                    onClick={() => {
                      setCurrentSong(songs[0]);
                      setIsPlaying(true);
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={450}
              height={240}
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

        {/* songs */}
        <div className="flex-1">
          {songs && songs.length > 0 ? (
            <h1 className="font-[800] text-neutral-100 text-2xl mb-1">Songs</h1>
          ) : (
            <Skeleton
              animation="wave"
              height={30}
              width={100}
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
          {songs && songs.length > 0 ? (
            <div>
              {songs.slice(0, 4).map((song, index) => (
                <div
                  key={index}
                  className="flex items-center rounded gap-3 p-2 hover:bg-neutral-800 bg-opacity-20 transition-all group"
                >
                  <div className="flex items-center justify-between w-full ">
                    <div className="flex items-center gap-3">
                      <div className="relative group flex items-center justify-center">
                        <img
                          src={song.image[2].url}
                          className="rounded w-10 overflow-hidden"
                        />
                        <div className="w-10 h-10 absolute bg-black rounded group-hover:bg-opacity-50 bg-opacity-0"></div>
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
                      <div>
                        <h1 className="text-neutral-100 font-semibold truncate overflow-hidden">
                          {song.name}
                        </h1>
                        <p className="text-neutral-400 group-hover:text-neutral-100 text-sm font-semibold truncate overflow-hidden">
                          {song.artists.primary[0].name}
                        </p>
                      </div>
                    </div>

                    <div className="me-10 text-sm text-neutral-400 font-semibold">
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
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
      </div>

      {/* artists */}
      {songs && songs.length > 0 ? (
        <div>
          {artists && (
            <div className="mt-16">
              <h1 className="font-[800] text-neutral-100 text-2xl mb-1 px-3">
                Artists
              </h1>
              <div className="grid grid-cols-6">
                <Link to={`/artist/${artists.id}`}>
                  <div className="transition-all hover:bg-neutral-800 p-3 rounded w-full flex flex-col items-center h-full">
                    <div className="relative group">
                      {Array.isArray(artists?.image) &&
                      artists.image.length > 2 &&
                      artists.image[2].url ? (
                        <img
                          src={artists?.image[2].url}
                          className="w-40 rounded-full mb-3"
                        />
                      ) : (
                        <div className="mb-3">
                          <Skeleton
                            variant="circular"
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
                        </div>
                      )}
                      <div className="active:scale-95 transition-all duration-200 group-hover:bottom-2 opacity-0 group-hover:opacity-100 text-white absolute bottom-0 right-2">
                        <FontAwesomeIcon
                          icon={faCirclePlay}
                          className="text-5xl text-[#00D4FF] shadow-lg"
                          onClick={() => {
                            setCurrentSong(artists);
                            setIsPlaying(true);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start w-full">
                      <h1 className="text-neutral-100 font-semibold w-40 line-clamp-2">
                        {artists.name}
                      </h1>
                      <p className="text-neutral-400 text-sm font-semibold">
                        {capitalizeFirstLetter(artists.type)}
                      </p>
                    </div>
                  </div>
                </Link>

                {artists?.similarArtists?.slice(0, 5).map((artist, index) => (
                  <Link to={`/artist/${artist.id}`} key={index}>
                    <div className="transition-all hover:bg-neutral-800 p-3 rounded w-full flex flex-col items-center h-full">
                      <div className="relative group">
                        {artist?.image[2]?.url || isLoading ? (
                          <img
                            src={artist.image[2].url}
                            className="w-40 rounded-full mb-3"
                          />
                        ) : (
                          <div className="mb-3">
                            <Skeleton
                              variant="circular"
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
                          </div>
                        )}
                        <div className="active:scale-95 transition-all duration-200 group-hover:bottom-2 opacity-0 group-hover:opacity-100 text-white absolute bottom-0 right-2">
                          <FontAwesomeIcon
                            icon={faCirclePlay}
                            className="text-5xl text-[#00D4FF] shadow-lg"
                            onClick={() => {
                              setCurrentSong(artist);
                              setIsPlaying(true);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <h1 className="text-neutral-100 font-semibold w-40 line-clamp-2">
                          {artist.name}
                        </h1>
                        <p className="text-neutral-400 text-sm font-semibold">
                          {capitalizeFirstLetter(artist.type)}
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

      {/* albums */}
      {songs && songs.length > 0 ? (
        <div>
          {albums.length > 0 && (
            <div className="mt-16">
              <h1 className="font-[800] text-neutral-100 text-2xl mb-1 px-3">
                Albums
              </h1>
              <div className="grid grid-cols-6">
                {albums?.slice(0, 6).map((album, index) => (
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

      {/* playlists */}
      {songs && songs.length > 0 ? (
        <div>
          {playlists.length > 0 && (
            <div className="mt-16">
              <h1 className="font-[800] text-neutral-100 text-2xl mb-1 px-3">
                Playlists
              </h1>
              <div className="grid grid-cols-6">
                {playlists?.slice(0, 6).map((playlist, index) => (
                  <Link to={`/playlist/${playlist.id}`} key={index}>
                    <div className="cursor-pointer transition-all hover:bg-neutral-800 p-3 rounded w-full flex flex-col items-center h-full">
                      <div>
                        {playlist?.image[2]?.url ? (
                          <img
                            src={playlist.image[2].url}
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
                          {playlist.name}
                        </h1>
                        <p className="font-semibold text-neutral-400 text-sm">
                          {capitalizeFirstLetter(playlist.type)}
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

export default All;
