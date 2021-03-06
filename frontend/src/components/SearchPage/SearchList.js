import React from "react";
import Card from "../Card";
import TrackRow from "../TrackRow";

const SearchList = ({ results, type }) => {
  let list;
  if (!(Object.entries(results) == 0)) {
    list = (
      <div className="search-list" style={type === 'track' ? {gridTemplateColumns: '1fr', gap: '0', justifyItems: 'stretch'} : {}}>
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
        })}
      </div>
    );
  }
  return (
    <>
      {!(Object.entries(results) == 0) && (
        <div className='result-container'>
          <h1>
            All results for "{results.q}"
          </h1>
          {list}
        </div >
      )}
    </>
  );
};

export default SearchList;
