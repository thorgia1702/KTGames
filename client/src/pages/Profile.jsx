import React, { useState } from "react";
import "./pages.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal, notification } from "antd";
import { useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [setLoading] = useState(false);
  const [open, setOpen] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

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

  const { currentUser, loading, error } = useSelector((state) => state.user);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePasswordCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...formData };
    // Check if password change is intended
    if (showPassword) {
      if (formData.password && formData.password.length < 8) {
        notification.error({
          message: "Error",
          description: "Password must be at least 8 characters long",
        });
        return;
      }
    } else {
      // Remove password from payload if not changing
      delete payload.password;
    }
    if (!/^\d{10}$/.test(payload.phone)) {
      notification.error({
        message: "Error",
        description: "Phone number must be a 10-digit number",
      });
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        notification.error({
          message: "Error",
          description: "Username or email address is already in use",
        });
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      notification.success({
        message: "Success",
        description: "User profile updated successfully",
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = currentUser._id;
      const res = await fetch(`/api/user/get/${userId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchUser();
  }, []);

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
          <p>Trophies: {currentUser.trophy}</p>
          <p>KT points: {currentUser.ktpoint}</p>
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
          footer={[]}
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
                src={formData.avatar || currentUser.avatar}
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
                  ""
                )}
              </p>
            </div>
            <form className="profile-info" onSubmit={handleSubmit}>
              <p>Username:</p>
              <input
                type="text"
                placeholder="Username"
                defaultValue={currentUser.username}
                className="edit-text"
                id="username"
                onChange={handleChange}
              ></input>

              <p>Email:</p>
              <input
                type="text"
                placeholder="Email"
                className="edit-text"
                defaultValue={currentUser.email}
                id="email"
                onChange={handleChange}
              ></input>

              <p>Phone number:</p>
              <input
                type="text"
                placeholder="Phone"
                defaultValue={currentUser.phone}
                className="edit-text"
                id="phone"
                onChange={handleChange}
              ></input>

              <p>Password:</p>
              <input
                type="password"
                className="edit-text"
                id="password"
                placeholder="Enter New Password"
                onChange={handleChange}
                disabled={!showPassword}
              ></input>

              <div className="checkbox-container">
                <label htmlFor="password-checkbox" className="password-label">
                  Change password?
                </label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={handlePasswordCheckboxChange}
                  className="password-checkbox"
                />
              </div>

              <br></br>
              <button disabled={loading} className="updatebtn">
                {loading ? "LOADING..." : "UPDATE"}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
