import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePlayerStore } from "../store/usePlayerStore";
import Slider from "@mui/material/Slider";
import {
  faBackwardStep,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
  faList,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../utils/formatDuration";

const Player = () => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    nextSong,
    prevSong,
    setIsLoading,
    isLoading,
    nextSongEnabled,
    prevSongEnabled,
    isQueueOpen,
    toggleQueueOpen,
  } = usePlayerStore();
  const audioRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current && currentSong?.downloadUrl?.[4]?.url) {
      setIsLoading(true);
      audioRef.current.load();
      setCurrentTime(0);
      setIsLoading(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong?.downloadUrl?.[4]?.url) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying, setIsPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const hasValidSong = currentSong && currentSong.downloadUrl?.[4]?.url;

  if (!hasValidSong) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-neutral-400 font-semibold">
        Play a song
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-between bg-black font-semibold select-none">
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={currentSong.downloadUrl[4].url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Left side */}
      <div className="w-96 ps-4">
        <div className="flex items-center gap-3">
          <img
            src={currentSong.image[2].url}
            className="w-16 h-16 rounded-md"
            alt="Album art"
          />
          <div>
            <h1 className="text-neutral-200">{currentSong.name}</h1>
            <p className="text-neutral-400 text-sm">
              {currentSong.artists.primary[0].name}
            </p>
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col justify-center items-center w-1/3">
        <div className="flex items-center gap-6 justify-center">
          <FontAwesomeIcon
            icon={faBackwardStep}
            className="text-2xl text-neutral-400 hover:text-white transition-all active:scale-95"
            onClick={prevSong}
          />
          {isPlaying ? (
            <FontAwesomeIcon
              icon={faCirclePause}
              className="text-4xl text-white active:scale-95 transition-all"
              onClick={() => setIsPlaying(false)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faCirclePlay}
              className="text-4xl text-white active:scale-95 transition-all"
              onClick={() => setIsPlaying(true)}
            />
          )}
          <FontAwesomeIcon
            icon={faForwardStep}
            className="text-2xl text-neutral-400 hover:text-white transition-all active:scale-95"
            onClick={nextSong}
          />
        </div>
        <div className="w-full h-7 flex items-center justify-center text-neutral-400 text-xs gap-3">
          <span>{formatDuration(currentTime)}</span>
          <Slider
            size="small"
            value={currentTime}
            max={duration || 1}
            onChange={(e, newValue) => {
              if (audioRef.current) {
                audioRef.current.currentTime = newValue;
                setCurrentTime(newValue);
              }
            }}
            sx={{
              color: "linear-gradient(to right, #00D4FF, #FF00E4)",
              "& .MuiSlider-thumb": {
                background: "radial-gradient(circle, #FF00E4 10%, #00D4FF 50%)",
                boxShadow: "0 0 5px #00D4FF",
              },
            }}
            aria-label="Progress"
          />
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="w-96 flex items-center justify-end pe-6 gap-5">
        <FontAwesomeIcon
          icon={faList}
          onClick={() => toggleQueueOpen()}
          className={`${isQueueOpen ? `text-white` : `text-neutral-400`}`}
        />

        <div className="w-32 flex items-center gap-2">
          <FontAwesomeIcon icon={faVolumeHigh} className="text-neutral-400" />
          <Slider
            valueLabelDisplay="auto"
            size="small"
            defaultValue={90}
            onChange={(e, newValue) => {
              if (audioRef.current) {
                audioRef.current.volume = newValue / 100;
              }
            }}
            sx={{
              color: "linear-gradient(to right, #00D4FF, #FF00E4)",
              "& .MuiSlider-thumb": {
                background: "radial-gradient(circle, #FF00E4 10%, #00D4FF 50%)",
                boxShadow: "0 0 5px #00D4FF",
              },
            }}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
