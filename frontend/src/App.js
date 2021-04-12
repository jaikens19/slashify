import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import AlbumDetail from "./components/AlbumDetail"
import SearchPage from "./components/SearchPage"
import SongWidget from "./components/SongWidget";
import ArtistDetail from "./components/ArtistDetail"
import Playlist from  "./components/Playlists"
import { getLikes } from "./store/likes"

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  
  useEffect(() => {
    if(sessionUser) {
      dispatch(getLikes(sessionUser.id))
    }
  },[dispatch, sessionUser])
  

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Navigation isLoaded={isLoaded} />
            <Dashboard />
            <SongWidget />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <ProtectedRoute path="/search">
            <Navigation isLoaded={isLoaded} />
            <SearchPage />
            <SongWidget />
          </ProtectedRoute>
          <ProtectedRoute path="/album/:id">
            <Navigation isLoaded={isLoaded} />
            <AlbumDetail />
            <SongWidget />
          </ProtectedRoute>
          <ProtectedRoute path="/artist/:id">
            <Navigation isLoaded={isLoaded} />
            <ArtistDetail />
            <SongWidget />
          </ProtectedRoute>
          <ProtectedRoute path="/playlist/:id">
            <Navigation isLoaded={isLoaded} />
            <Playlist />
            <SongWidget />
          </ProtectedRoute>
        </Switch>
      )}
    </>
  );
}

export default App;
