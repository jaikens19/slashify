import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getAlbum } from "../../store/albums";

const AlbumDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { [id]: album } = useSelector((state) => state.albums);

  useEffect(() => {
    if (!album) {
      dispatch(getAlbum(id));
    } 
  }, [album]);

  const convertTime = (ms) => {
      const minutes = ms / 1000 / 60
      const seconds = (minutes % 1).toFixed(4) * 60
      return `${Math.floor(minutes)} min, ${Math.floor(seconds)} sec`
  }

  return <h1>Album Detail Page</h1>;
};

export default AlbumDetail;
