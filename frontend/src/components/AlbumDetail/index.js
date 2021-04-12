import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { removeLike, addLike } from "../../store/likes";
import TrackRow from "../TrackRow/";
import { getAlbum } from "../../store/albums";
import { checkText, getColors, defaultAvatar } from "../../utils";

import "./AlbumDetail.css";

const AlbumDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const { [id]: like } = useSelector((state) => state.likes);
  const { [id]: album } = useSelector((state) => state.albums);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorState, setColorState] = useState("#000000");

  async function setBackgroundColor(image) {
    setColorState((await getColors(image))[0]);
  }
  
  useEffect(() => {
    if (album) setBackgroundColor(album.image);
  }, [album]);
  
  useEffect(() => {
    if (!album) dispatch(getAlbum(id));
    else setIsLoaded(true);
  }, [id, dispatch, album]);
  
  useEffect(() => {
    setIsLiked(like ? true : false)
  }, [like])

  

  function convertTime(ms) {
    const minutes = ms / 1000 / 60;
    const seconds = (minutes % 1).toFixed(4) * 60;
    return `${Math.floor(minutes)} min, ${Math.floor(seconds)} sec`;
  }
  
  async function toggleLike() {
    if (isLiked) {
      console.log(sessionUser.id, id)
      setIsLiked(await dispatch(removeLike(sessionUser.id, id)));
    } else {
      setIsLiked(await dispatch(addLike(sessionUser.id, id, "album")));
    }
  }

  return (
    <div className="page album-page">
      <div
        className="album"
        style={{ background: `linear-gradient(${colorState},#0f0f0f 550px)` }}
      >
        {isLoaded && (
          <>
            <div className="album-details">
              <img
                className="album-image"
                src={album?.image}
                alt="album-cover"
              />
              <div className="album-text">
                <p>ALBUM</p>
                <h1>{checkText(album?.name, 30)}</h1>
                <div className="album-stats">
                  <div className="album-artist">
                    <img
                      className="album-artist-image"
                      src={album?.artists[0]?.image || defaultAvatar}
                      alt="artist-avatar"
                    />
                    <a
                      className="album-artist-name"
                      href={`/artist/${album?.artists[0]?.id}`}
                    >
                      {album?.artists[0]?.name}
                    </a>
                  </div>
                  <p className="album-year">{album?.release_date}</p>
                  <p className="album-songs">{`${
                    album?.songs.total
                  } songs, ${convertTime(album?.totalDuration)}`}</p>
                </div>
              </div>
            </div>
            <div className="album-tracks">
              <div className="buttons">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
                <i
                  className={`${isLiked ? "fas" : "fal"} fa-heart heart-album`}
                  onClick={toggleLike}
                  style={{ color: isLiked ? "#1db954" : "" }}
                ></i>
                <i className="far fa-ellipsis-h dropdown-button"></i>
              </div>
              <div className="tracks">
                <>
                  {album?.songs.tracks.map((track) => (
                    <TrackRow
                      key={track.id}
                      id={track.id}
                      rowInfo={{
                        name: track.name,
                        artists: track.artists,
                        explicit: track.explicit,
                        duration: track.duration,
                        number: track.track_number,
                      }}
                    />
                  ))}
                </>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
