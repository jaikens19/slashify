const express = require("express");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { setSpotifyToken } = require("../../utils/auth");

const router = express.Router();

router.use(setSpotifyToken);

let headers = {};
router.use((req, res, next) => {
  headers = { Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}` };
  next();
});

router.get("/", (req, res) => {
  res.json({ test: "message" });
});

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const types = ["album", "artist", "playlist", "track"];
    const { q, type } = req.query;
    if (q && types.includes(type)) {
      let config = {
        method: "get",
        url: `https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=50`,
        headers,
      };

      const response = await axios(config);
      if (response.status === 200) {
        switch (type) {
          case "track":
            const { tracks } = response.data;
            res.json({
              total: tracks.total,
              tracks: Object.assign(
                ...tracks.items.map((track) => {
                  return {
                    [track.id]: {
                      openUrl: track.external_urls["spotify"],
                      image: track.album.images[0]
                        ? track.album.images[0].url
                        : "",
                      name: track.name,
                      duration: track.duration_ms,
                      explicit: track.explicit,
                      popularity: track.popularity,
                      artists: track.album.artists.map((artist) => {
                        return {
                          id: artist.id,
                          name: artist.name,
                        };
                      }),
                      album: {
                        id: track.album.id,
                        name: track.album.name,
                      },
                    },
                  };
                })
              ),
            });
            break;
          case "playlist":
            const { playlists } = response.data;
            res.json({
              total: playlists.total,
              playlists: Object.assign(
                ...playlists.items.map((playlist) => {
                  return {
                    [playlist.id]: {
                      openUrl: playlist.external_urls["spotify"],
                      image: playlist.images[0] ? playlist.images[0].url : "",
                      name: playlist.name,
                      description: playlist.description,
                      songs: {
                        total: playlist.tracks.total,
                      },
                    },
                  };
                })
              ),
            });
            break;
          case "album":
            const { albums } = response.data;
            res.json({
              total: albums.total,
              items: albums.items,
              albums: Object.assign(
                ...albums.items.map((album) => {
                  return {
                    [album.id]: {
                      openUrl: album.external_urls["spotify"],
                      name: album.name,
                      artists: album.artists.map((artist) => artist.name),
                      image: album.images[0] ? album.images[0].url : "",
                      songs: {
                        total: album.total_tracks,
                      },
                    },
                  };
                })
              ),
            });
            break;
          case "artist":
            const { artists } = response.data;

            res.json({
              total: artists.total,
              items: artists.items,
              artists: Object.assign(
                ...artists.items.map((artist) => {
                  return {
                    [artist.id]: {
                      openUrl: artist.external_urls["spotify"],
                      image: artist.images[0] ? artist.images[0].url : "",
                      name: artist.name,
                      genres: artist.genres,
                      followers: artist.followers.total,
                      popularity: artist.popularity,
                    },
                  };
                })
              ),
            });
            break;

          default:
            break;
        }
      }
    } else {
      res.json("ERROR");
    }
  })
);

router.get(
  "/albums",
  asyncHandler(async (req, res) => {
    const { albumIds } = req.query;
    if (albumIds) {
      let config = {
        method: "get",
        url: `https://api.spotify.com/v1/albums?ids=${albumIds}`,
        headers,
      };

      const response = await axios(config);
      if (response.status === 200) {
        const albums = {};
        response.data.albums.forEach((album) => {
          totalDuration = 0;
          albums[album.id] = {
            openUrl: album.external_urls["spotify"],
            image: album.images[0].url,
            label: album.label,
            name: album.name,
            release_date: album.release_date.split("-")[0],
            genres: album.genres.map((genre) => genre),
            artists: album.artists.map((artist) => {
              return {
                name: artist.name,
                id: artist.id,
              };
            }),
            copyrights: album.copyrights.map((copy) => copy.text),
            songs: {
              total: album.total_tracks,
              tracks: album.tracks.items.map((track) => {
                totalDuration += track.duration_ms;
                return {
                  name: track.name,
                  artists: track.artists.map((artist) => {
                    return {
                      name: artist.name,
                      id: artist.id,
                    };
                  }),
                  duration: track.duration_ms,
                  track_number: track.track_number,
                  explicit: track.explicit,
                };
              }),
            },
          };
          albums[album.id].totalDuration = totalDuration;
        });
        res.json({ albums });
      } else {
        res.json({ response: `${response.status}` });
      }
    } else {
      res.json({ error: "No albumId" });
    }
  })
);

module.exports = router;
