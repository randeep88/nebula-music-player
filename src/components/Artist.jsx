import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { usePlayerStore } from "../store/usePlayerStore";
import { Skeleton } from "@mui/material";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const Artist = () => {
  const { artists, setCurrentSong, setIsPlaying } = usePlayerStore();
  console.log(artists);

  return (
    <div className="p-5">
      {artists && (
        <div>
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
  );
};

export default Artist;
