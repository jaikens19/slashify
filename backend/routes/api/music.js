const express = require("express");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { setSpotifyToken } = require("../../utils/auth");

const router = express.Router();

router.use(setSpotifyToken);

const defaultAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEX29/fW1tbz9PTX19ft7u7w8fHc3Nzn6Ojk5OT19vbd3d3q6+vh4eHT09Pj4+Pv7+8nGkdkAAAENklEQVR4nO2d7ZKrIAyGFaqgiL3/u111t1vrVkugm5jO+8zs+dcZ3kPIF6GtKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwL/RGWM66UX8EyaMva3rOk5/th+DkV7Qe2m8jbO0OzHasZFe1tsI9lHdr0obpJf2Fvb0fYpG0+7rWzS2ym3VHetbNDrpRZbQvxY4SRykl5lNZxP0zbRKQ6RJ1DdhVUrs0gVOKJSYbKJqd7ElCZzOovSCqQxEgXUcpZdMI6SEiY3Ei/SiKdC8zA3pVVMg2+iCIju90m10JuqpGal+9Iaa9C1zC2s9cT/vFM5oKTOyt7C20ktPIyMW3lDia/KNVIuZ0lLuR3rpxadg8o1UyUEsOIZKDqIvEKgj/S5xNHXU0D/tSxSqcKa5Sek3Xnr5CZQp1FBBQaF+hWWeRsM5LIoWKnxpWcTXEA/LsjYNt4lNiUIdfYwSgSpqiyJnqiFYVJXLF6iitCgrgaXXnkh+VqOlJZwdL1TEioXcXpSeW9KEKZqnW6jDzyzkbaKeLayqS84mquiz/ZJRYEQNhdMKup1qstEZev6tIudeQwyKekLhHZJEFZXvHwgSdQokSNQqsKquiQoV5TJbuhdT3ssGWlWRvmouzvuVX/SvJK4DfeO9C82Jw0bj27g8HIn9fZXmcNZ7PapvhuWzMVp/ztDhHt5VrDq7za6pxnZ1AtfNj2jP1xn29ebVT7s6XWZ88qok1sNqq7bvMmJ9Lv96fabgYRuurl8ssP75t320xCcV5cP/kTTPK94/SzRNCM65EK4bZ7LzsOY8YXLXXyY+h9n//EkKqoOAkPJy6/Dl1yk6xMe52eQVj+KbcQf60q3gX3ldCMZ+byPD63dRJ6iqUor5GHu3XWnj+piSmYs/NUluyMS6HXwIl8slBD+0dXJpJdwHJzYr4je0z8jaadngRRqiLaqiG+1URAN/ybBsOoIXwyxbKHqfwXEKZ8ROYtnUBQExdzoyCZQbYGATKHW/n/+8iYyQrykaYCMiY6ZcnnRGJCR2fEYqdD+cdZOdrVAic+M8hjKzw2XTzlQk0hpWgRIRseiJGh0BV8PqaERifsEUaRb8bcWyRwd0+BtSnBnNDL8z5Wlg3OHP23gdzeRquAUyB4tJIXfvm7E4/FHI3clgDocCAZGpkbhSyF1dcAd8/pDPWzvNcNdPn6+Qr1d6g7sZxZ2W8iemUAiFUPgXbk/z+dHi83Oaz8+8WW8tFoXss1Gf38XgdjX8FxdsYwrfSAwr8LYTJW5meO8PrwIKWa/XZL5PkfC9+cUIjdGydaPkBtsyv1mALFBwnJ1Fouy8PoNDlf4uiS7ph1YK9PXSs/rTNh6/CSnTZ8/xgLYZtr/I9RZ10Y4icf45zfyrau8rN+z8y2zyr2UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn5AvEEjipkcYsygAAAABJRU5ErkJggg==";

const defaultImage = "https://img.pngio.com/my-my-png-album-covers-500_500.png";
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
    const { q, type, limit, offset } = req.query;
    if (q && types.includes(type)) {
      let config = {
        method: "get",
        url: `https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=${limit}&offset=${offset}`,
        headers,
      };

      const response = await axios(config);
      if (response.status === 200) {
        if (response.data[`${type}s`].items.length) {
          switch (type) {
            case "track":
              const { tracks } = response.data;
              res.json({
                total: tracks.total,
                track: Object.assign(
                  ...tracks.items.map((track) => {
                    return {
                      [track.id]: {
                        openUrl: track.external_urls["spotify"],
                        image: track.images[0].url || defaultImage,
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
                playlist: Object.assign(
                  ...playlists.items.map((playlist) => {
                    return {
                      [playlist.id]: {
                        openUrl: playlist.external_urls["spotify"],
                        image: playlist.images[0].url || defaultImage,
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
                album: Object.assign(
                  ...albums.items.map((album) => {
                    return {
                      [album.id]: {
                        openUrl: album.external_urls["spotify"],
                        name: album.name,
                        artists: album.artists.map((artist) => artist.name),
                        image: album.images[0].url || defaultImage,
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
                artist: Object.assign(
                  ...artists.items.map((artist) => {
                    return {
                      [artist.id]: {
                        openUrl: artist.external_urls["spotify"],
                        image: artist.images[0].url || defaultAvatar,
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
        } else {
          res.json("NO RESULTS", 204);
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
            image: album.images[0].url || defaultImage,
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
                  id: track.id,
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

router.get(
  "/playlist/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id) {
      const config = {
        method: "get",
        url: `https://api.spotify.com/v1/playlists/${id}`,
        headers,
      };
      const response = await axios(config);

      if (response.status === 200) {
        const {
          id,
          external_urls,
          images,
          name,
          description,
          followers,
          owner,
          tracks,
        } = response.data;
        res.status(200).json({
          playlist: {
            [id]: {
              openUrl: external_urls["spotify"],
              image: images[0].url || defaultImage,
              name,
              description,
              likes: followers.total,
              owner: {
                id: owner.id,
                openUrl: owner.external_urls["spotify"],
                name: owner.display_name,
              },
              songs: {
                total: tracks.total,
                tracks: tracks.items.map((track) => {
                  const {
                    id,
                    name,
                    artists,
                    duration_ms,
                    explicit,
                    album,
                  } = track.track;
                  return {
                    id,
                    name,
                    image: album.images[0].url || defaultImage,
                    artists: artists.map((a) => {
                      return {
                        id: a.id,
                        name: a.name,
                      };
                    }),
                    duration: duration_ms,
                    explicit: explicit,
                  };
                }),
              },
            },
          },
        });
      } else res.status(500).json({ message: "NO PLAYLIST ID" });
    } else res.json({ message: "Please provide a playlist id." }, 400);
  })
);

router.get(
  "/artist",
  asyncHandler(async (req, res) => {
    const { artistIds } = req.query;
    if (artistIds) {
      const config = {
        method: "get",
        url: `https://api.spotify.com/v1/artists?ids=${artistIds}`,
        headers,
      };
      const response = await axios(config);
      if (response.status === 200) {
        const { artists } = response.data;
        res.status(200).json({
          artists: Object.assign(
            ...artists.map((artist) => {
              const {
                id,
                external_urls,
                followers,
                images,
                name,
                genres,
                popularity,
              } = artist;
              return {
                [id]: {
                  openUrl: external_urls["spotify"],
                  image: images[0].url || defaultAvatar,
                  name,
                  genres,
                  popularity,
                  followers: followers.total,
                },
              };
            })
          ),
        });
      } else res.status(500).json({ message: "NO ARTIST ID" });
    } else res.json({ message: "Please provide an artist id." }, 400);
  })
);

module.exports = router;
