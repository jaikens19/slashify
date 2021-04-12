const UPDATE_SONGLINK = 'songbar/updateSongLink'

const updateLink = link => ({
    type: UPDATE_SONGLINK,
    link,
})

export const updateSongLink = link => async dispatch => {
    dispatch(updateLink(link))
}

const initialState = {
  link: "https://open.spotify.com/embed/album/1Op6caTUaT8v4XXec3CfpW",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SONGLINK:
      return {
        ...state,
        link: action.link,
      };
    default:
      return state;
  }
}