import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSongLink } from "../../store/songbar";
import "./Card.css";

const Card = ({ id, type, cardInfo }) => {
  const { image, title, text } = cardInfo;
  const history = useHistory();
  const dispatch = useDispatch();
  const navigate = (id) => {
    if(type !== 'track'){

      history.push(`/${type}/${id}`);
    }
  };

  const updatePlayer = (e) => {
    e.stopPropagation();
    dispatch(updateSongLink(`https://open.spotify.com/embed/${type}/${id}`));
  };
  return (
    <div
      className="card-container"
      onClick={() => {
        navigate(id);
      }}
    >
      <div className="square">
        <div
          className="card-image-container"
          src={image}
          alt="card"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="card-play-btn" onClick={updatePlayer}>
            <i className="fas fa-play"></i>
          </div>
        </div>
      </div>
      <div className="card-info">
        <b>{title}</b>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Card;
