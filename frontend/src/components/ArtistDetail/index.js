import React, { useEffect, useState } from "react";
import "./ArtistDetail.css";
import { getArtist } from "../../store/artists";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import TrackRow from "../TrackRow";
import { checkText, getColors, defaultAvatar } from "../../utils";
import Card from "../Card";

const ArtistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [colorState, setColorState] = useState("#000");
  const [showMore, setShowMore] = useState(false);
  const { [id]: artist } = useSelector((state) => state.artists);

  useEffect(() => {
    if (!artist) {
      dispatch(getArtist(id));
    } else {
      setIsLoaded(true);
    }
  }, [id, dispatch, artist]);

  async function setBackgroundColor(image) {
    setColorState((await getColors(image, 0.35))[0]);
  }

  useEffect(() => {
    if (artist) setBackgroundColor(artist.image);
  }, [artist]);

  function changeFollow() {
    setIsFollowed(!isFollowed);
  }

  const { name, followers, image, topTracks, albums } = artist || {};

  let tracks;
  if (topTracks) {
    tracks = Object.entries(topTracks).map((track, i) => {
      const [id, rowInfo] = track;
      if (i < (showMore ? 10 : 5))
        return <TrackRow key={id} id={id} rowInfo={rowInfo} />;
    });
  }
  let discography;
  if (albums) {
    discography = Object.entries(albums).map((album, i) => {
      const [id, albumInfo] = album;
      const { image, name, artists } = albumInfo;
      return (
        <Card
          key={id}
          type="artist"
          id={id}
          cardInfo={{
            image,
            title: name,
            text: artists.join(", "),
          }}
        />
      );
    });
  }

  return (
    <div className="page artist-page">
      <div className="artist" style={{}}>
        {isLoaded && (
          <>
            <div
              className="artist-details"
              style={{
                backgroundImage: `linear-gradient(${colorState} 25%, #000000aa), url(${image})`,
              }}
            >
              <div className="artist-text">
                {followers > 500000 && (
                  <div className="verified-artist">
                    <i
                      className="fad fa-badge-check"
                      style={{
                        "--fa-primary-color": "#fff",
                        "--fa-secondary-color": "#2e77d0",
                        "--fa-secondary-opacity": 1,
                      }}
                    ></i>
                    <p>Verified Artist</p>
                  </div>
                )}
                <h1>{checkText(name, 30)}</h1>
                <div className="artist-stats">
                  <p>
                    {followers
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    followers
                  </p>
                </div>
              </div>
            </div>
            <div className="artist-tracks">
              <div className="buttons">
                <div className="play-button">
                  <i className="fas fa-play"></i>
                </div>
                <div
                  className={`follow-button ${isFollowed ? "active" : ""}`}
                  onClick={changeFollow}
                >
                  {isFollowed ? "FOLLOWING" : "FOLLOW"}
                </div>
                <i className="far fa-ellipsis-h dropdown-button"></i>
              </div>
              <div className="top-tracks">
                <b>Popular</b>
                {tracks}
                <div>
                  <b
                    onClick={() => setShowMore(!showMore)}
                    className="show-button"
                  >
                    {showMore ? "SEE LESS" : "SEE MORE"}
                  </b>
                </div>
                <div className="artist-discography">
                  <b>Discography</b>
                  <div
                    className="artists-discography-list"
                    style={
                      {
                            gridTemplateColumns: `repeat(${count}, 1fr)`,
                            gap: "0",
                            justifyItems: "stretch",
                          }
                       
                    }
                  >
                    {discography}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
