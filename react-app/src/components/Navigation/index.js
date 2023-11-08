import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

const logoImage =
  "https://cdn.discordapp.com/attachments/1169328578379387000/1171868618510848020/logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      <li className="nav-item">
        <NavLink exact to="/" className="nav-link">
          <img src={logoImage} alt="Logo" className="logo" />
        </NavLink>
      </li>
      {isLoaded && sessionUser && (
        <li className="nav-item">
          <NavLink to="/upload" className="nav-link">
            New Post
          </NavLink>
        </li>
      )}
      {isLoaded && (
        <li className="nav-item">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
