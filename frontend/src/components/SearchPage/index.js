import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./SearchPage.css";
import { searchResults } from "../../store/search";


const SearchPage = () => {
  const dispatch = useDispatch();
  const types = ["album", "artist", "playlist", "track"];
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("album");

  const checkKey = (e) => {
    const codes = ["Enter", "NumpadEnter"];
    if (codes.includes(e.code)) {
      submitSearch();
    }
  };

  const submitSearch = () => {
    if (searchInput) {
        console.log({ q: searchInput, type: searchType})
      dispatch(searchResults({ q: searchInput, type: searchType}));
    }
  };

  let searchInputField
  useEffect(() => {
      searchInputField.focus()
  })

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
          onKeyPress={checkKey}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          maxLength={50}
          placeholder="Search here"
          type="text"
          ref={text => {
              searchInputField = text
          }}
        ></input>
      </div>
      <h1>SEARCH PAGE</h1>
      <h1>SEARCH RESULT HERE::::::</h1>
    </div>
  );
};

export default SearchPage;
