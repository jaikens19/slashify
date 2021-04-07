import React from "react";
import Card from "../Card";
import TrackRow from "../TrackRow";

const SearchList = ({ results, type }) => {
  let list;
  if (!(Object.entries(results) == 0)) {
    list = (
      <div className="search-list">
        {Object.entries(results.results).map((result) => {
          switch (type) {
            case "album":
              return (
                <Card
                  key={result[0]}
                  type={type}
                  id={result[0]}
                  cardInfo={{
                    image: result[1].image,
                    title: result[1].name,
                    text: result[1].artists.join(", "),
                  }}
                />
              );
            case "artist":
              return (
                <Card
                  key={result[0]}
                  type={type}
                  id={result[0]}
                  cardInfo={{
                    image: result[1].image,
                    title: result[1].name,
                    text: result[1].genres.join(", "),
                  }}
                />
              );
            case "playlist":
              return (
                <Card
                  key={result[0]}
                  type={type}
                  id={result[0]}
                  cardInfo={{
                    image: result[1].image,
                    title: result[1].name,
                    text: result[1].description,
                  }}
                />
              );
            case "track":
              return (
                <TrackRow key={result[0]} id={result[0]} rowInfo={result[1]} />
              );
            default:
              break;
          }

          // return <SearchRow key={result[0]} result={result} type={type} />;
        })}
      </div>
    );
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
