import React, { useState } from "react";
import "../pages.css";
import "./admin.css"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal, notification } from "antd";
import { useRef, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false); // Added state for showing/hiding password input
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
    if (formData.password && formData.password.length < 8) {
      // Check if a password is provided and it's less than 8 characters
      notification.error({
        message: "Error",
        description: "Password must be at least 8 characters long",
      });
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
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
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        notification.error({
          message: "Error",
          description: data.message,
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

  return (
    <div className="profile-page">
      <h1>Manage item</h1>
      <div className="item-list">
        <h2>Items</h2>
        <h2>Items</h2>
        <h2>Items</h2>
        <h2>Items</h2>
      </div>

      <div className="add-item">
        <button className="showModal-btn" onClick={showModal}>
          Add new item
        </button>
        <Modal
          open={open}
          title="ITEM INFORMATION"
          centered
          width={1000}
          onOk={handleOk}
          onCancel={handleCancel}
          className="my-modal"
          footer={[]}
        >
          <div className="form-container">
            <form className="item-info" onSubmit={handleSubmit}>
              <p>Item name:</p>
              <input
                type="text"
                placeholder="Item name"
                className="item-information"
                id="name"
                onChange={handleChange}
              ></input>

              <p>Item description:</p>
              <textarea
                type="text"
                placeholder="Item description"
                className="item_description"
                id="description"
                onChange={handleChange}
              ></textarea>

              <p>Point:</p>
              <input
                type="number"
                placeholder="Require point"
                className="item-information"
                id="point"
                onChange={handleChange}
              ></input>

              <p>Item Image:</p>
              <input
                type="file"
                className="item-information"
                id="image"
                onChange={handleChange}
              ></input>
              
              <br></br>
              <Button disabled={
            loading ||
            !formData.name ||
            !formData.description ||
            !formData.point ||
            !formData.image
          } className="add-btn">
                {loading ? "LOADING..." : "ADD ITEM"}
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
