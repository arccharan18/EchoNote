import "./Player.scss";
import { useDispatch, useSelector } from "react-redux";
import { dislikeSong, likeSong } from "../../store/thunks/user";
import { useCallback, useEffect, useRef, useState } from "react";
import { playPause } from "../../store/reducers/player";
import { nextSong, prevSong } from "../../store/reducers/queue";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  RiHeart2Fill,
  RiHeart2Line,
  RiPauseCircleFill,
  RiPlayCircleFill,
  RiRepeatOneLine,
  RiShuffleLine,
  RiSkipBackMiniFill,
  RiSkipForwardMiniFill,
  RiVolumeDownLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
} from "react-icons/ri";

const Player = () => {
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeatSong, setRepeatSong] = useState(false);

  const currentIndex = useSelector((state) => state.queue.current);
  const queue = useSelector((state) => state.queue.list);
  const song = queue[currentIndex];
  const { likedSongs } = useSelector((state) => state.user.data);
  const { isPlaying } = useSelector((state) => state.player);
  const dispatch = useDispatch();

  const audioRef = useRef();
  const progressRef = useRef();
  const volumeRef = useRef();

  const repeat = useCallback(() => {
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    progressRef.current.value = time;
  }, []);

  useEffect(() => {
    if (audioRef.current === undefined) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => console.error("Playback error: ", error));
    } else {
      audioRef.current.pause();
    }

    const animationFrame = requestAnimationFrame(repeat);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, repeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const increaseCount = async () => {
      try {
        if (song && song.id) {
          const accessToken = 'BQBYm3rbHNdPZlToUgGLTA-ruhgML4L5GeuMNj2w4NTYHl7proaD86NKGzLcNGjRKyuoamF4_t2gABI9IeyJv8r5yjrV4xamKCDavcXEFhSZHb2Yj9RnJG5mUjgKDDCy35Ig5m8t2WjnecuM-D8CnuDDQASgP8FPBSMqhej5ZJicIEVNpc0FfqqRNyt7K-O_lMylYvv6hcPmuQiWB5ht7JMo1vEZoikCDyEZM4-EDL4AZqGJjm24qZlgqnXDrHxkCQpdkNrLsXAnYsPW9-wijxrA';
          const spotifyResponse = await axios.get(`https://api.spotify.com/v1/tracks/${song.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(spotifyResponse.data);
        }
      } catch (error) {
        console.error("Error while increasing plays count: ", error);
      }
    };
    increaseCount();
  }, [song]);

  const likeSongHandler = () => {
    if (song && song.id) {
      dispatch(likeSong(song.id));
    }
  };

  const dislikeSongHandler = () => {
    if (song && song.id) {
      dispatch(dislikeSong(song.id));
    }
  };

  const togglePlayPauseHandler = () => {
    dispatch(playPause());
  };

  const progressChangeHandler = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = progressRef.current.value;
    }
  };

  const volumeChangeHandler = (e) => {
    setVolume(e.target.value);
  };

  const onLoadedMetadataHandler = () => {
    if (audioRef.current) {
      const seconds = audioRef.current.duration;
      setDuration(seconds);
      progressRef.current.max = seconds;
    }
  };

  const handleNext = () => {
    dispatch(nextSong());
  };

  const handlePrev = () => {
    dispatch(prevSong());
  };

  const repeatSongHandler = () => {
    setRepeatSong((state) => !state);
    if (audioRef.current) {
      audioRef.current.loop = !repeatSong;
    }
  };

  const onEndedHandler = () => {
    handleNext();
  };

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  const userLikedSong = () => {
    return song && song.id && likedSongs.some((likedSong) => likedSong.id === song.id);
  };

  return (
    <div className="player">
      {song ? (
        <>
          <div className="player__song">
            <img src={song.img} alt="" />
            <div className="player__song-context">
              <span className="player__song-name">{song.name}</span>
              <Link
                to={song.artist ? `/artist/${song.artist.id}` : "#"}
                className="player__song-artist"
              >
                {song.artist ? song.artist.name : "Unknown Artist"}
              </Link>
            </div>
            {userLikedSong() === true ? (
              <RiHeart2Fill
                className="player__song__like player__song__like--active"
                onClick={dislikeSongHandler}
              />
            ) : (
              <RiHeart2Line
                className="player__song__like"
                onClick={likeSongHandler}
              />
            )}
          </div>
          <div>
            <audio
              ref={audioRef}
              src={song.song}
              onLoadedMetadata={onLoadedMetadataHandler}
              onEnded={onEndedHandler}
            />

            <div className="player__icons">
              <RiShuffleLine />
              <RiSkipBackMiniFill onClick={handlePrev} />
              <button
                className="player__icon-btn"
                onClick={togglePlayPauseHandler}
              >
                {isPlaying ? (
                  <RiPauseCircleFill className="spinner" />
                ) : (
                  <RiPlayCircleFill />
                )}
              </button>
              <RiSkipForwardMiniFill onClick={handleNext} />
              <RiRepeatOneLine
                className={repeatSong ? "player__repeat active" : "player__repeat"}
                onClick={repeatSongHandler}
              />
            </div>
            <div className="player__range">
              <span className="player__range-time">
                {formatTime(currentTime)}
              </span>
              <input
                ref={progressRef}
                type="range"
                value={currentTime}
                max={duration}
                onChange={progressChangeHandler}
              />
              <span className="player__range-time">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="player__volume">
            {Number(volume) === 0 ? (
              <RiVolumeMuteLine />
            ) : Number(volume) < 50 ? (
              <RiVolumeDownLine />
            ) : (
              <RiVolumeUpLine />
            )}
            <input
              ref={volumeRef}
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={volumeChangeHandler}
            />
          </div>
        </>
      ) : (
        <div className="player__note">Please select a song 🐈 . . .</div>
      )}
    </div>
  );
};

export default Player;
