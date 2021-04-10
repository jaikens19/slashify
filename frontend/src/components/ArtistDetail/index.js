import React, { useEffect, useState } from "react";
import "./ArtistDetail.css";
import { getArtist } from "../../store/artists";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const ArtistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { [id]: artist } = useSelector((state) => state.artists);

  useEffect(() => {
    if (!artist) {
      dispatch(getArtist(id));
    } else {
        setIsLoaded(true)
    }
  }, [id, dispatch, artist]);
console.log(artist)

  return (
    <div>
      {isLoaded && (
        <div className="page">
          <h1>Artist Detail</h1>
          <p>{artist.name}</p>
          <p>{}</p>
          <img src={artist.image}/>
          <p>{artist.popularity}</p>
          {artist.genres.map((genre) => (
            <p>{genre}</p>
          ))}
          <p>{artist.followers}</p>
        </div>
      )}
    </div>
  );
};

export default ArtistDetail;
