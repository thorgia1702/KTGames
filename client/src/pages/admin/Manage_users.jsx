import React, { useState, useEffect } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";
import { Link } from "react-router-dom";

export default function Manage_users() {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUsersError, setShowUsersError] = useState(false);

  const showErrorModal = (errorMessage) => {
    Modal.error({
      title: "Error",
      content: errorMessage,
      centered: true,
    });
  };

  const showUsers = async () => {
    try {
      setShowUsersError(false);
      const res = await fetch("api/user/users");
      const data = await res.json();
      if (data.success === false) {
        setShowUsersError(true);
        return;
      }
      setUsers(data);
    } catch (error) {
      setShowUsersError(true);
    }
  };

  useEffect(() => {
    showUsers();
  }, []);

  const handleDeleteUser = (UserId) => {
    setDeleteConfirmation(true);
    setDeleteUserId(UserId);
  };

  const confirmDelete = async () => {
    if (deleteUserId) {
      try {
        const res = await fetch(`/api/user/delete/${deleteUserId}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success === false) {
          const errorMessage = data.message;
          setError(errorMessage);
          showErrorModal(data.message);
        } else {
          notification.success({
            message: "Success",
            description: "User deleted successfully",
          });
          setDeleteConfirmation(false);
          setDeleteUserId(null);
          showUsers();
        }
      } catch (error) {
        const errorMessage = error.message;
        setError(errorMessage);
        setLoading(false);
        showErrorModal(errorMessage);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
    setDeleteUserId(null);
  };

  return (
    <div>
      <h1>Manage users</h1>
      <div className="list-of-users">
        <div className="column-header">
          <p className="item-name">ㅤㅤAvatar</p>
          <p className="item-name">Username</p>
          <p className="item-name">Email</p>
          <p className="item-name">Phone</p>
          <p className="item-name">Trophy</p>
          <p className="item-name">Kt point</p>
          <p className="item-name">Role</p>
          <p className="item-name">Status</p>
          <p className="item-name">ㅤㅤAction</p>
        </div>
        {users
          .filter((user) => user.username !== "admin")
          .map((user) => (
            <div key={user._id} className="item-card">
              <img src={user.avatar} alt="item image" className="item-image" />
              <p className="item-name">{user.username}</p>
              <p className="item-name">{user.email}</p>
              <p className="item-name">{user.phone}</p>
              <p className="item-name">{user.trophy}</p>
              <p className="item-name">{user.ktpoint}</p>
              <p className="item-name">{user.role}</p>
              <p className="item-name">{user.status}</p>
              <div className="btn">
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="delete-btn"
                >
                  DELETE
                </button>

                <Link to={`/update-user/${user._id}`}>
                  <button className="edit-btn">EDIT</button>
                </Link>
              </div>
            </div>
          ))}
      </div>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteConfirmation}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        centered
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
}
