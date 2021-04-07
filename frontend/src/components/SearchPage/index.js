import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SearchPage.css";
import { searchResults } from "../../store/search";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import SearchList from "./SearchList";


const SearchPage = () => {
  const dispatch = useDispatch();
  const types = ["album", "artist", "playlist", "track"];
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("album");
  const [searchOffset, setSearchOffset] = useState(0)
  const [searchLimit, setSearchLimit] = useState(50)
  const [searchLoaded, setSearchLoaded] = useState(true)
  const { [searchType]: searchResultsObj } = useSelector(
    (state) => state.search
  );
  function getDocHeight() {
    let D = document;
    return Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
  }

  function amountScrolled() {
    let winheight =
      window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
    let docheight = getDocHeight();
    let scrollTop =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
    let trackLength = docheight - winheight;
    let pctScrolled = Math.floor((scrollTop / trackLength) * 100); // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    return pctScrolled
  }

  const checkKey = (e) => {
    const codes = ["Enter", "NumpadEnter"];
    if (codes.includes(e.code)) {
      submitSearch();
    }
  };

  const submitSearch = async () => {
    if (searchInput) {
      setSearchLoaded(await dispatch(searchResults({ q: searchInput, type: searchType, limit: searchLimit, offset: searchOffset * searchLimit })));
      
    }
  };

  let searchInputField;
  useEffect(() => {
    searchInputField.focus();
  });

  useEffect(() => {
    submitSearch()
  }, [searchOffset])

  useScrollPosition(() => {
    let percent = amountScrolled()
    if(percent > 85 && searchLoaded){
      setSearchLoaded(false)
      setSearchOffset(searchOffset + 1)
      submitSearch()
    }
  });

  return (
    <div className="search-page-container page">
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
          ref={(text) => {
            searchInputField = text;
          }}
        ></input>
      </div>
      <SearchList results={searchResultsObj} type={searchType} />
    </div>
  );
};

export default SearchPage;
