import React, { useEffect, useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const types = ["album", "artist", "playlist", "track"];
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("album");

  useEffect(() => {
    console.log({ input: searchInput, type: searchType });
  }, [searchInput, searchType]);

  return (
    <div className="search-page-container">
      <div className="search-bar">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          {types.map((type) => (
            <option value={type} key={type}>
              {type.slice(0, 1).toUpperCase() + type.slice(1, type.length)}
            </option>
          ))}
        </select>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          maxLength={50}
          placeholder="Search here"
          type="text"
        ></input>
      </div>
      <h1>SEARCH PAGE</h1>
      <h1>SEARCH RESULT HERE::::::</h1>
    </div>
  );
};

export default SearchPage;
