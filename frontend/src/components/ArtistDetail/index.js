import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Card from "../Card";
import TrackRow from "../TrackRow";
import { getArtist } from "../../store/artists";
import { checkText, updatePlayer, getColors } from "../../utils";

import "./ArtistDetail.css";

export default function ArtistDetailPage() {
  const max = 4;

  const dispatch = useDispatch();
  const { id } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [colorState, setColorState] = useState("#000");
  const [showMore, setShowMore] = useState(false);
  const { [id]: artist } = useSelector((state) => state.artists);

  useEffect(() => {
    if (!artist) dispatch(getArtist(id));
    else setIsLoaded(true);
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

  let count;
  const { name, followers, image, topTracks, albums, relatedArtists } =
    artist || {};

  let tracks;
  if (topTracks) {
    tracks = Object.entries(topTracks)
      .slice(0, showMore ? 10 : 5)
      .map((track) => (
        <TrackRow key={track[0]} id={track[0]} rowInfo={track[1]} />
      ));
  }
  let discography;
  if (albums) {
    discography = Object.entries(albums)
      .slice(0, max)
      .map((album, i) => {
        const [albumId, albumInfo] = album;
        const { image, name, artists } = albumInfo;
        return (
          <Card
            key={albumId}
            type="album"
            id={albumId}
            cardInfo={{ image, title: name, text: artists.join(", ") }}
          />
        );
      });
    count = Math.min(Object.keys(albums).length, max);
  }

  let related;
  if (relatedArtists) {
    related = Object.entries(relatedArtists)
      .slice(0, max)
      .map((artistRel, i) => {
        const [artistId, artistInfo] = artistRel;
        const { name, image } = artistInfo;
        return (
          <Card
            key={artistId}
            type="artist"
            id={artistId}
            cardInfo={{ image, title: name, text: "Artist" }}
          />
        );
      });
  }

  return (
    <div className="page artist-page">
      <div className="artist" style={{}}>
        {isLoaded && artist && (
          <>
            <div
              className="artist-details"
              style={{
                backgroundImage: `linear-gradient(${colorState} 25%,#000000aa), url(${image})`,
              }}
            >
              <div className="artist-text">
                {(followers > 500000 || name === "LilDeuceDeuce") && (
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

            <div className="artist-music">
              <div className="buttons">
                <div
                  className="play-button"
                  onClick={(e) => updatePlayer(dispatch, e, "artist", id)}
                >
                  <i className="fas fa-play"></i>
                </div>
                <div
                  className={`follow-button ${isFollowed ? "active" : ""}`}
                  onClick={changeFollow}
                >
                  <b>{isFollowed ? "FOLLOWING" : "FOLLOW"}</b>
                </div>
                <i className="far fa-ellipsis-h dropdown-button"></i>
              </div>
              <div className="artist-top-tracks">
                <b className="artist-detail-title">Popular</b>
                <div>{tracks}</div>
                <div>
                  <b
                    onClick={() => setShowMore(!showMore)}
                    className="artist-tracks-toggle"
                  >
                    {showMore ? "SEE LESS" : "SEE MORE"}
                  </b>
                </div>
              </div>
              <div className="artist-discography">
                <b className="artist-detail-title">Discography</b>
                <div
                  className="artist-discography-list"
                  style={{
                    gridTemplateColumns: `repeat(${count},1fr)`,
                    "--columns": count,
                  }}
                >
                  {discography}
                </div>
              </div>
              <div className="artist-related">
                <b className="artist-detail-title">More like {name}</b>
                <div
                  className="artist-related-list"
                  style={{
                    gridTemplateColumns: `repeat(${count},1fr)`,
                    "--columns": count,
                  }}
                >
                  {related}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
