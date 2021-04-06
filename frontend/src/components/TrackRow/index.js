import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./TrackRow.css";
import {updateSongLink} from '../../store'


const TrackRow = ({ rowInfo }) => {
  const { openUrl, image, name, artists, explicit, duration } = rowInfo;
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch()
  const widgetState = useSelector(state => state.songbar)

  const convertTime = (ms) => {
    const minutes = ms / 1000 / 60;
    const seconds = (minutes % 1).toFixed(4) * 60;
    return `${Math.floor(minutes)}:${String(Math.floor(seconds)).padStart(
      2,
      "0"
    )}`;
  };
  const toggleLike = () => {
      setIsLiked(!isLiked)
  }

  const updatePlayer = () => {
    dispatch(updateSongLink(openUrl))
  }

  return (
    <div className="track-results-row">
      <div className="track-results-info">
        <div className="track-results-image-container">
          <div className="track-results-image-overlay">
            <i className="fas fa-play"></i>
          </div>
          <img className="track-results-image" src={image} />
        </div>
        <div className="track-results-row-name">
          <b>{name}</b>
          <div className="track-results-row-artist">
            {explicit && <span className="track-results-row-explicit">E</span>}
            <p>{artists.map((artist) => artist.name).join(", ")}</p>
          </div>
        </div>
      </div>
      <div className="track-results-row-btn">
        <i
          className={`${
            isLiked ? "fas is-liked" : "fal"
          } fa-heart heart-button`}
          onClick={toggleLike}
        ></i>
        <p className="track-results-duration">{convertTime(duration)}</p>
        <i className="far fa-ellipsis-h"></i>
      </div>
    </div>
  );
};

export default TrackRow;
