import React, { useState } from "react";
import "./SearchPage.css";

const SearchRow = ({ result, type }) => {
  const [id, data] = result;

  const [openUrl] = useState(data.openUrl);

  let row;
  switch (type) {
    case "album":
      row = (
        <div className="search-results-container">
          <img src={data.image} />
          <p>{data.name}</p>
        </div>
      );
      break;
    case "artist":
      break;
    case "playlist":
      break;
    case "track":
      break;
    default:
      break;
  }

  return row
  
  
};

export default SearchRow;
