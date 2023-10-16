import React, { useState } from "react";
import "./pages.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});

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
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName =
      new Date().getTime() + file.name + Math.random().toString(36).slice(-8);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

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
          <p>Phone: {currentUser.phone}</p>
          <p>Rank: {currentUser.rank}</p>
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
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar ||currentUser.avatar}
                className="avatar"
              />
              <p>
                {fileUploadError ? (
                  <span>Error Image upload</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span>{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span>Image upload successfully!</span>
                ) : (
                  ''
                )}
              </p>
            </div>
            <div className="profile-info">
              <input
                type="text"
                placeholder="Username"
                className="edit-text"
                id="username"
              ></input>
              <input
                type="text"
                placeholder="Email"
                className="edit-text"
                id="email"
              ></input>
              <input
                type="text"
                placeholder="Phone"
                className="edit-text"
                id="phone"
              ></input>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
