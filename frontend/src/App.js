import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage"
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import AlbumDetail from "./components/AlbumDetail"
import SearchPage from "./components/SearchPage"
import SongWidget from "./components/SongWidget";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Navigation isLoaded={isLoaded} />
            <SplashPage />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <ProtectedRoute path="/dashboard">
            <Navigation isLoaded={isLoaded} />
            <Dashboard />
            <SongWidget />
          </ProtectedRoute>
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
        </Switch>
      )}
    </>
  );
}

export default App;
