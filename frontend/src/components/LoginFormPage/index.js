import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).catch(
      (res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      }
    );
  };

  return (
    <>
      <div className="login-top-container">
        <a href="/login">
          <img alt='login-logo' className="login-logo" src="images/logo.svg"></img>
        </a>
      </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-social-container">
            <h1>To continue, log in to Spotify.</h1>
            <button className="login-facebook login-social">
              CONTINUE WITH FACEBOOK
            </button>
            <button className="login-apple login-social">
              CONTINUE WITH APPLE
            </button>
            <button className="login-google login-social">
              CONTINUE WITH GOOGLE
            </button>
          </div>
          <hr className="social-hr-or" />
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <input type="checkbox" id="remember" />
          <label for="remember">Remember me</label>
          <button type="submit">Log In</button>
          <h1>Don't have an account?</h1>
          <button>SIGN UP FOR SPOTIFY</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormPage;
