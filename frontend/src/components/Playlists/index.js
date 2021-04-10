import React, { useEffect, useState } from "react";
import "./Playlist.css";
import { getPlaylists } from "../../store/playlists";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import TrackRow from "../TrackRow";
import { checkText, getColors, defaultAvatar } from "../../utils";

// bad playlist ID: 2KrnunwPRQhX2x4KYLb4Ed 


const Playlist = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [colorState, setColorState] = useState("#000000");
  const [isLoaded, setIsLoaded] = useState(false);
  const { [id]: playlist } = useSelector((state) => state.playlists);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!playlist) {
      dispatch(getPlaylists(id));
        // console.log(playlist.owner.id)
    } else {
      setIsLoaded(true);
    }
  }, [id, dispatch, playlist]);

  async function setBackgroundColor(image) {
    setColorState((await getColors(image))[0]);
  }

  useEffect(() => {
    if (playlist) setBackgroundColor(playlist.image);
  }, [playlist]);

  function changeLike() {
    setIsLiked(!isLiked);
  }

  return (
    <div className="page playlist-detail">
      <div
        className="playlist"
        style={{ background: `linear-gradient(${colorState},#0f0f0f 550px)` }}
      >
        {isLoaded && (
          <>
            <div className="playlist-details">
              <img
                className="playlist-image"
                src={playlist?.image}
                alt="playlist-cover"
              />
              <div className="playlist-text">
                <p>PLAYLIST</p>
                <h1>{checkText(playlist?.name, 30)}</h1>
              </div>
              <div className="playlist-stats">
                <p>{playlist.description}</p>
                <a
                  className="album-artist-name"
                  href={`/user/${playlist.owner.id}`}
                >
                  {playlist.owner.name}
                </a>
                <p className="playlist-likes">{playlist.likes} likes</p>
                <p className="playlist-songs">{playlist.songs.total} songs</p>
              </div>
            </div>
            <div className="playlist-tracks">
              <div className="buttons">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
                <i
                  className={`${isLiked ? "fas" : "fal"} fa-heart heart-album`}
                  onClick={changeLike}
                  style={{ color: isLiked ? "#1db954" : "" }}
                ></i>
                <i className="far fa-ellipsis-h dropdown-button"></i>
              </div>
              <div className="tracks">
                <>
                  {playlist?.songs.tracks.map((track) => (
                    <TrackRow
                      key={track.id}
                      id={track.id}
                      rowInfo={{
                        image: track.image,
                        name: track.name,
                        artists: track.artists,
                        explicit: track.explicit,
                        duration: track.duration,
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

export default Playlist;
