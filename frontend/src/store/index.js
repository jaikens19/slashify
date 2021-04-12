import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import albums from "./albums";
import search from "./search";
import songbar from "./songbar"
import artists from "./artists"
import playlists from "./playlists"
import likes from "./likes"
import dashboard from "./dashboard"

const rootReducer = combineReducers({
  session,
  albums,
  search,
  songbar,
  artists,
  playlists,
  likes,
  dashboard
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
