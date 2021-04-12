import React from "react";
import { NavLink, useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SearchPage from "../SearchPage";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  function navigate(direction) {
    history.go(direction);
  }

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = <ProfileButton user={sessionUser} />;
  
  } else {
    sessionLinks = (
      <>
        <NavLink to="/login"> Login </NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
    <div className="navbar-container">
      <div className="navbar-btns-container">
        <div className="navbar-history-btn">
            <i onClick={() => history.push('/')} class="fas fa-home"></i>
        </div>
        <div className="navbar-history-btn" onClick={() => history.goBack()}>
          <i className="fal fa-chevron-left"></i>
        </div>
        <div className="navbar-history-btn" onClick={() => history.goForward()}>
          <i className="fal fa-chevron-right"></i>
        </div>
        <div
          className="navbar-history-btn"
          onClick={() => history.push("/search")}
        >
          <i className="fal fa-search"></i>
        </div>
      </div>
      {isLoaded && sessionLinks}
    </div>
  );
};

export default Navigation;
