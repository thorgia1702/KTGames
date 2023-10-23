import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function UpdateUser() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    trophy: 0,
    ktpoint: 0,
    phone: 1234567890,
    role: "",
  });

  const params = useParams();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      navigate("/users");
    }, 3000);
  };

  const showErrorModal = (errorMessage) => {
    Modal.error({
      title: "Error",
      content: errorMessage,
      centered: true,
    });
  };

  const handleCancel = () => {
    setOpen(false);
    navigate("/users");
  };

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

  useEffect(() => {
    const fetchUser = async () => {
      const userId = params.userId;
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

  useEffect(() => {
    showModal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      notification.error({
        message: "Error",
        description: "Phone number must be a 10-digit number",
      });
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/user/update/${params.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        const errorMessage = data.message;
        setError(errorMessage);
        showErrorModal("User have already existed");
      } else {
        notification.success({
          message: "Success",
          description: "User updated successfully",
        });
        navigate("/users");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="profile-actions">
      <Modal
        open={open}
        title="EDIT PROFILE"
        centered
        width={1000}
        onOk={handleOk}
        onCancel={handleCancel}
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
              src={formData.avatar}
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
              defaultValue={formData.username}
              className="edit-text"
              id="username"
              onChange={handleChange}
            ></input>

            <p>Email:</p>
            <input
              type="text"
              placeholder="Email"
              className="edit-text"
              defaultValue={formData.email}
              id="email"
              onChange={handleChange}
            ></input>

            <p>Phone number:</p>
            <input
              type="text"
              placeholder="Phone"
              defaultValue={formData.phone}
              className="edit-text"
              id="phone"
              onChange={handleChange}
            ></input>

            <br />
            <button type="submit" disabled={loading} className="updatebtn">
              {loading ? "LOADING..." : "UPDATE"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
