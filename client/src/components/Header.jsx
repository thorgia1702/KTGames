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
} from "@ant-design/icons";
import { useSelector } from "react-redux";

export default function Header() {
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
      <div className="logo-container">
        <Link to="/">
          <img
            className="logo"
            src={Logo}
            alt="Logo"
            height={120}
            width={380}
          />
        </Link>
      </div>

      {/* Left Sidebar (Navigation) */}
      <div className={`sidebar ${navSidebarVisible ? "visible" : ""}`}>
        {/* Fold Button for Navigation Sidebar (Inside Sidebar, Top Right) */}
        <div className="fold-button" onClick={toggleNavSidebar}>
          {navSidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </div>
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
        <ul className="sidenav">
          <li>
            <a href="/">
              <button className="navbutton">Home</button>
            </a>
          </li>
          <li>
            <a href="/dashboard">
              <button className="navbutton">Dashboard</button>
            </a>
          </li>
          <li>
            <a href="/chess">
              <button className="navbutton">Chess</button>
            </a>
          </li>
          <li>
            <a href="/tic_tac_toe">
              <button className="navbutton">Tic tac toe</button>
            </a>
          </li>
          <li>
            <a href="/battleship">
              <button className="navbutton">Battle ship</button>
            </a>
          </li>
          <li>
            <a href="/bingo">
              <button className="navbutton">Bingo</button>
            </a>
          </li>
        </ul>
      </div>

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
          <Link to="/profile">
            {currentUser ? (
              <div className="profile-logo-container">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="avatar"
                />
              </div>
            ) : (
              <button className="sign">Sign in</button>
            )}
          </Link>

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
