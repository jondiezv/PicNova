import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const profileMenuRef = useRef();

  const openMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    function closeMenu(e) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    setShowMenu(false);
  };

  const profileMenuClassName = showMenu
    ? "profile-menu show"
    : "profile-menu hide";

  return (
    <>
      <button onClick={openMenu} className="profile-button-custom">
        {user ? (
          <span className="profile-initial-custom">
            {user.username.charAt(0).toUpperCase()}
          </span>
        ) : (
          <i className="fas fa-user"></i>
        )}
      </button>
      <ul className={profileMenuClassName} ref={profileMenuRef}>
        {user ? (
          <>
            <li className="profile-username-custom">{user.username}</li>
            <li className="profile-posts-link-custom">
              <Link to={`/posts/${user.id}`} onClick={() => setShowMenu(false)}>
                Posts
              </Link>
            </li>
            <li className="profile-logout-button-custom" onClick={handleLogout}>
              Log Out
            </li>
          </>
        ) : (
          <>
            <div className="login-signup-buttons">
              <OpenModalButton
                buttonText="Log In"
                onItemClick={() => setShowMenu(false)}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={() => setShowMenu(false)}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
