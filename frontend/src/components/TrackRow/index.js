import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./TrackRow.css";
import { updateSongLink } from "../../store/songbar";

const TrackRow = ({ id, rowInfo }) => {
  const { openUrl, image, name, artists, explicit, duration } = rowInfo;
  const history = useHistory();
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();

  const convertTime = (ms) => {
    const minutes = ms / 1000 / 60;
    const seconds = (minutes % 1).toFixed(4) * 60;
    return `${Math.floor(minutes)}:${String(Math.floor(seconds)).padStart(
      2,
      "0"
    )}`;
  };
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const navigate = (link) => {
    history.push(link);
  };

  const updatePlayer = () => {
    dispatch(updateSongLink(`https://open.spotify.com/embed/track/${id}`));
  };

  return (
    <div className="track-results-row">
      <div className="track-results-info">
        <div className="track-results-image-container" onClick={updatePlayer}>
          <div className="track-results-image-overlay">
            <i className="fas fa-play"></i>
          </div>
          <img className="track-results-image" src={image} />
        </div>
        <div className="track-results-row-name">
          <b>{name}</b>
          <div className="track-results-row-artist">
            {explicit && <span className="track-results-row-explicit">E</span>}
            <div className="track-results-row-artist-list">
              {artists.map((artist) => {
                return (
                  <p
                    className="track-results-row-artist-link"
                    onClick={() => navigate(`/artist/${artist.id}`)}
                  >
                    {artist.name}
                  </p>
                );
              })}
            </div>
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