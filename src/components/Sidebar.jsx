import { usePlayerStore } from "../store/usePlayerStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const Sidebar = () => {
  const {
    songsQueue,
    isQueueOpen,
    currentSong,
    isPlaying,
    setIsPlaying,
    setCurrentSong,
    setSongsQueue,
    songs,
  } = usePlayerStore();

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setSongsQueue(songs);
    setIsPlaying(true);
  };

  return (
    <div className="h-full border">
      {isQueueOpen ? (
        <div>
          <div className="mb-2 p-2 font-bold overflow-hidden">
            <h1>Queue</h1>
          </div>
          <div className=" overflow-y-scroll bg-neutral-900">
            <div>
              {songsQueue.map((song, index) => (
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
                            onClick={() => handlePlaySong(song)}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="mb-2 p-2 font-bold">Your Library</h1>
          <div className="hover:bg-neutral-800 transition-all p-2 rounded flex items-center gap-3 cursor-pointer">
            <div className="h-12 w-12 bg-neutral-500 rounded"></div>
            <div>
              <h1 className="font-semibold">Pbx1</h1>
              <p className="text-sm text-neutral-400 font-semibold">
                Album &bull; Sidhu Moose Wala
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
