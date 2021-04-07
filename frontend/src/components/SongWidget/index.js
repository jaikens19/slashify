import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./SongWidget.css";

const SongWidget = () => {
  const songbar = useSelector((state) => state.songbar);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [songbar]);

  return (
    isLoaded && (
      <iframe
        className="songwidget"
        src={songbar.link}
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    )
  );
};

export default SongWidget
