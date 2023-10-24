import React, { useState, useEffect } from "react";
import "./pages.css";
import { useDispatch, useSelector } from "react-redux";

export default function Leaderboard() {
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUsersError, setShowUsersError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const showUsers = async () => {
    try {
      setShowUsersError(false);
      const res = await fetch("api/user/users");
      const data = await res.json();
      if (data.success === false) {
        setShowUsersError(true);
        return;
      }
      // Sort users by Trophy points in descending order
      const sortedUsers = data.sort((a, b) => b.trophy - a.trophy);
      setLeaderboardUsers(sortedUsers);
    } catch (error) {
      setShowUsersError(true);
    }
  };

  useEffect(() => {
    showUsers();
  }, []);

  return (
    <div>
      <h1>LEADERBOARD</h1>
      <div className="user-list">
        <div className="list-header">
          <p className="user-rank">Rank</p>
          <p className="user-information">Avatar</p>
          <p className="user-information" id="header-name">
            Username
          </p>
          <p className="user-information" id="trophies">Trophies</p>
        </div>
        {leaderboardUsers.map((user, index) => (
          <div
            key={user._id}
            className={
              currentUser?._id === user._id ? "current-user-card" : "user-card"
            }
          >
            <p className="user-rank" id="number">
              {index + 1}
            </p>
            <img src={user.avatar} alt="user-avatar" className="user-avatar" />
            <p className="user-information" id="name">
              {user.username}
            </p>
            <p className="user-information" id="trophy">{user.trophy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
