import React, { useState } from "react";
import "./pages.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-container">
        <div className="profile-header">
          <img src={currentUser.avatar} className="avatar" />
        </div>
        <div className="profile-info">
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>Phone: {currentUser.phone}000000000</p>
          <p>Rank: {currentUser.rank}0</p>
          <p>KT points: {currentUser.ktpoint}0</p>
        </div>
      </div>

      <div className="profile-actions">
        <Button className="edit_btn" onClick={showModal}>
          EDIT PROFILE
        </Button>
        <Modal
          open={open}
          title="EDIT PROFILE"
          centered
          width={1000}
          onOk={handleOk}
          onCancel={handleCancel}
          className="my-modal"
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              Submit
            </Button>,
          ]}
        >
          <div className="profile-container">
        <div className="profile-header">
          <img src={currentUser.avatar} className="avatar" />
        </div>
        <div className="profile-info">
          <input type="text" placeholder="Username" className="edit-text" id="username"></input>
          <input type="text" placeholder="Email" className="edit-text" id="email"></input>
          <input type="text" placeholder="Phone" className="edit-text" id="phone"></input>
        </div>
      </div>
        </Modal>
      </div>
    </div>
  );
}
