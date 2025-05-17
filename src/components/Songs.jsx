import { usePlayerStore } from "../store/usePlayerStore";
import { formatDuration } from "../utils/formatDuration";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gif from "../assets/music1.gif";

const Songs = () => {
  const {
    songs,
    isPlaying,
    setIsPlaying,
    setCurrentSong,
    currentSong,
    songsQueue,
    setSongsQueue,
  } = usePlayerStore();

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setSongsQueue(songs);
    setIsPlaying(true);
  };

  console.log("Queue", songsQueue);

  return (
    <div className="bg-neutral-900">
      <div className="flex sticky top-12 bg-neutral-900 z-20 items-center gap-3 text-neutral-400 font-semibold border-b border-neutral-700 mx-5 p-2">
        <div className="text-center text-lg w-14">#</div>
        <div className="w-2/3 text-sm">Title</div>
        <div className="w-2/4 text-center text-sm">Album</div>
        <div className="w-2/12 text-center text-sm">Duration</div>
      </div>

      <div className="p-5">
        {songs?.map((song, index) => (
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
                  onClick={() => handlePlaySong(song)}
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
  );
};

export default Songs;
