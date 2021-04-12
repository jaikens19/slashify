import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeLike, addLike } from "../../store/likes"
import { checkText, updatePlayer } from "../../utils";

import "./TrackRow.css";

export default function TrackRow({ id, rowInfo }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user)
  const { [id]: like } = useSelector(state => state.likes)
  const [isLiked, setIsLiked] = useState(like ? true : false);
  const { image, name, artists, explicit, duration, number } = rowInfo;
  
  function convertTime(ms) {
    const minutes = ms / 1000 / 60;
    const seconds = (minutes % 1).toFixed(4) * 60;
    return `${Math.floor(minutes)}:${String(Math.floor(seconds)).padStart(
      2,
      "0"
    )}`;
  }

  function navigate(link) {
    history.push(link);
  }

  async function toggleLike() {
    if(isLiked){
      setIsLiked(await dispatch(removeLike(sessionUser.id, id)));
    } else {
      setIsLiked(await dispatch(addLike(sessionUser.id, id, "track")));
    }
  }

  return (
    <div className="track-result-row">
      <div className="track-result-row-info">
        <div
          className="track-result-image-container"
          onClick={(e) => updatePlayer(dispatch, e, "track", id)}
        >
          <div className="track-result-row-overlay">
            <i className="fas fa-play"></i>
          </div>
          {image && <img className="track-result-row-image" src={image} />}
          {!image && <p className="track-result-number">{number}</p>}
        </div>
        <div className="track-result-row-text">
          <b>{checkText(name, 50)}</b>
          <div className="track-result-row-artist">
            {explicit && <span className="track-result-row-explicit">E</span>}
            <div className="track-result-row-artist-list">
              {checkText(
                artists.map((artist) => {
                  return (
                    <p
                      key={artist.id}
                      className="track-result-row-artist-link"
                      onClick={() => navigate(`/artist/${artist.id}`)}
                    >
                      {artist.name}
                    </p>
                  );
                }),
                10
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="track-result-row-buttons">
        <i
          className={`${isLiked ? "fas is-liked" : "fal"} fa-heart heart-track`}
          style={{ color: isLiked ? "#1db954" : "" }}
          onClick={toggleLike}
        ></i>
        <p className="track-result-row-duration">{convertTime(duration)}</p>
        <i className="far fa-ellipsis-h track-options"></i>
      </div>
    </div>
  );
}
