import React from "react";
import SearchRow from './SearchRow'

const SearchList = ({ results }) => {

  let list
  if (!(Object.entries(results) == 0)) {
    list = Object.entries(results.results).map(result => {
        return <SearchRow key={result[0]} result={result} />   
    });
  }
  return (
    <>
      {!(Object.entries(results) == 0) && (
        <>
          <h1>
            results for "{results.q}" returned: {results.total} results
          </h1>
          {list}
        </>
      )}
    </>
  );
};

export default SearchList;
