import React, { useState, useEffect } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";

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
        {users.map((user) => (
          <div key={user._id} className="item-card">
            <img src={user.avatar} alt="item image" className="item-image" />
            <p className="item-name">{user.username}</p>
            <p className="item-name">{user.email}</p>
            <p className="item-name">{user.phone}</p>
            <p className="item-name">{user.trophy}</p>
            <p className="item-name">{user.ktpoint}</p>
            <p className="item-name">{user.isBanned === false ? 'Un-ban' : 'Banned'}</p>
            <div className="btn">
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="delete-btn"
              >
                DELETE
              </button>
              <button className="edit-btn">EDIT</button>
              <button className="ban-btn">{user.isBanned === false ? 'BAN' : 'UN-BAN'}</button>
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
