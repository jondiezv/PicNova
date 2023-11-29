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
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const profileMenuClassName = "profile-menu" + (showMenu ? " show" : " hide");

  const closeMenu = () => setShowMenu(false);

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
              <Link to={`/posts/${user.id}`} onClick={closeMenu}>
                Posts
              </Link>
            </li>
            <li className="profile-logout-button-custom" onClick={handleLogout}>
              Log Out
            </li>
          </>
        ) : (
          <>
            <li className="profile-login-modal-custom">
              <OpenModalButton
                buttonText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li className="profile-signup-modal-custom">
              <OpenModalButton
                buttonText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
