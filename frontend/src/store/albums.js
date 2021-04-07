import { fetch } from "./csrf.js";

const ADD_ALBUMS = "albums/addAlbums";

// action creator
const addAlbums = (albums) => ({
  type: ADD_ALBUMS,
  albums,
});

// thunk action
export const getAlbum = (ids) => async (dispatch) => {
  const res = await fetch(`/api/music/albums?albumIds=${ids}`);

  if (res.ok) {
    dispatch(addAlbums(res.data.albums))
  }
};

const initialState = {};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ALBUMS:
      return {
        ...state,
        ...action.albums,
      };
    default:
      return state;
  }
}
