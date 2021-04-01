const express = require("express");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { setSpotifyToken } = require("../../utils/auth");

const router = express.Router();

router.use(setSpotifyToken);

router.get("/", (req, res) => {
  res.json({ test: "message" });
});

router.get(
  "/albums",
  asyncHandler(async (req, res) => {
    const { albumIds } = req.query;
    if (albumIds) {
      let config = {
        method: "get",
        url: `https://api.spotify.com/v1/albums?ids=${albumIds}`,
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
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
            release_date: album.release_date.split('-')[0],
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
