import { fetch } from "./csrf.js";

const ADD_PLAYLISTS = "artists/addPlaylists";

//action creator
const addPlaylists = (playlists) => ({
  type: ADD_PLAYLISTS,
  playlists,
});

export const getPlaylists = (ids) => async (dispatch) => {
  const res = await fetch(`/api/music/playlist/${ids}`);
  console.log(res.data.playlist);
  if (res.ok) {
    dispatch(addPlaylists(res.data.playlist));
  }
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PLAYLISTS:
      return {
        ...state,
        ...action.playlists,
      };
    default:
      return state;
  }
}
