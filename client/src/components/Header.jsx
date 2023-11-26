import "./Header.css";
import "./Styles.css";
import { Link } from "react-router-dom";
import Logo from "../images/ktgame_logo.png";
import React, { useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  signOutFailure,
  signOutSuccess,
  signOutStart,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  };
  const { currentUser } = useSelector((state) => state.user);
  const [navSidebarVisible, setNavSidebarVisible] = useState(false);
  const [profileSidebarVisible, setProfileSidebarVisible] = useState(false);

  const toggleNavSidebar = () => {
    setNavSidebarVisible(!navSidebarVisible);
  };

  const toggleProfileSidebar = () => {
    setProfileSidebarVisible(!profileSidebarVisible);
  };

  return (
    <div
      className={`header ${
        navSidebarVisible || profileSidebarVisible ? "sidebar-open" : ""
      }`}
    >
      {/* Unfold Button for Navigation Sidebar (Outside Sidebar) */}
      <div className="unfold-button" onClick={toggleNavSidebar}>
        {navSidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </div>

      {/* Logo */}
      {currentUser && currentUser.role === "admin" ? (
        <div className="logo-container">
          <Link to="/">
            <img
              className="logo"
              src={Logo}
              alt="Logo"
              height={120}
              width={320}
            />
          </Link>
        </div>
      ) : (
        <div className="logo-container">
          <Link to="/">
            <img
              className="logo"
              src={Logo}
              alt="Logo"
              height={120}
              width={320}
            />
          </Link>
        </div>
      )}

      {/* Left Sidebar (Navigation) */}
      <div className={`sidebar ${navSidebarVisible ? "visible" : ""}`}>
        {/* Fold Button for Navigation Sidebar (Inside Sidebar, Top Right) */}
        <div className="fold-button" onClick={toggleNavSidebar}>
          {navSidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </div>
        {currentUser && currentUser.role === "admin" ? (
          <div className="mini-logo-container">
            <a href="/">
              <img
                className="logo"
                src={Logo}
                alt="Logo"
                height={90}
                width={230}
              />
            </a>
          </div>
        ) : (
          <div className="mini-logo-container">
            <a href="/">
              <img
                className="logo"
                src={Logo}
                alt="Logo"
                height={90}
                width={230}
              />
            </a>
          </div>
        )}
        {currentUser && currentUser.role === "admin" ? (
          <ul className="sidenav">
            <li>
              <a href="/">
                <button className="navbutton">Home</button>
              </a>
            </li>
            <li>
              <a href="/users">
                <button className="navbutton">Manage users</button>
              </a>
            </li>
            <li>
              <a href="/items">
                <button className="navbutton">Manage items</button>
              </a>
            </li>
            <li>
              <a href="/orders">
                <button className="navbutton">Manage orders</button>
              </a>
            </li>
            <li>
              <a href="/leaderboard">
                <button className="navbutton">Leaderboard</button>
              </a>
            </li>
            <li>
              <a href="/ktshop">
                <button className="navbutton">KT Shop</button>
              </a>
            </li>
          </ul>
        ) : (
          <ul className="sidenav">
            <li>
              <a href="/">
                <button className="navbutton">Home</button>
              </a>
            </li>
            <li>
              <a href="/leaderboard">
                <button className="navbutton">Leaderboard</button>
              </a>
            </li>
            <li>
              <a href="/tic-tac-toe">
                <button className="navbutton">Tic tac toe</button>
              </a>
            </li>
            <li>
              <a href="/bingo">
                <button className="navbutton">Bingo</button>
              </a>
            </li>
            <li>
              <a href="/ktshop">
                <button className="navbutton">KT Shop</button>
              </a>
            </li>
          </ul>
        )}
      </div>

      {currentUser ? (
        <div className="user_info_header">
          <p className="user_info_header_text">{currentUser.username}</p>
          <p className="user_info_header_text">
            KT Points: {currentUser.ktpoint}
          </p>
        </div>
      ) : (
        <></>
      )}
      {/* Unfold Button for Navigation Sidebar (Outside Sidebar) */}
      <div className="profile-unfold-button" onClick={toggleProfileSidebar}>
        {profileSidebarVisible ? <CloseOutlined /> : <UserOutlined />}
      </div>
      {/* Right Sidebar (Profile) */}
      <div
        className={`profile-sidebar ${profileSidebarVisible ? "visible" : ""}`}
      >
        {/* Fold Button for Profile Sidebar (Inside Sidebar, Top Left) */}
        <div className="profile-fold-button" onClick={toggleProfileSidebar}>
          {profileSidebarVisible ? <CloseOutlined /> : <UserOutlined />}
        </div>
        {currentUser ? (
          <></>
        ) : (
          <div className="profile-logo-container">
            <a href="/">
              <img
                className="profile-logo"
                src={Logo}
                alt="Logo"
                height={90}
                width={230}
              />
            </a>
          </div>
        )}

        <ul className="profile-sidenav">
          {currentUser ? (
            <div className="profile-logo-container">
              <img
                src={currentUser.avatar}
                alt="profile"
                className="sidebar_avatar"
              />
              <p>{currentUser.username}</p>
              <p>
                KT Points: {currentUser.ktpoint}
              </p>
              <p>
                Trophies: {currentUser.trophy}
              </p>
              <Link to="/profile">
                <button className="sign-out">Profile</button>
              </Link>
              <button className="sign-out" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/sign-in">
              <button className="sign">Sign in</button>
            </Link>
          )}

          <Link to="/sign-up">
            {currentUser ? (
              <h1></h1>
            ) : (
              <button className="sign">Sign up</button>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
