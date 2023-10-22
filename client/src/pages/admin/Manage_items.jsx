import React, { useState } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

export default function Profile() {
  const [setLoading] = useState(false);
  const [open, setOpen] = useState(undefined);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  console.log(formData);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);  
  const showErrorModal = (errorMessage) => {
    Modal.error({
      title: "Error",
      content: errorMessage,
      centered: true,
    });
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setUploading(false);
          setImageUploadError("Image upload false");
          showErrorModal("Image upload failed");
        });
    } else if (files.length === 0) {
      setUploading(false);
      setImageUploadError("Please choose an image");
      showErrorModal("Please choose an image");
    } else {
      setUploading(false);
      setImageUploadError("You can only upload 6 images");
      showErrorModal("You can only upload 6 images");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

              <div>
                <p>Item Image:</p>
                <input
                  type="file"
                  className="item-information"
                  id="image"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                ></input>
                <Button
                  className="upload-btn"
                  onClick={handleImageSubmit}
                  type="button"
                  disabled={uploading}
                >
                  {uploading ? 'UPLOADING...' : 'UPLOAD'}
                </Button>
              </div>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div key={url} className="uploaded-container">
                    <img src={url} alt="item image" className="uploaded-img" />
                    <Button
                      className="delete-uploaded"
                      type="button"
                      onClick={()=>handleRemoveImage(index)}
                    >
                      DELETE
                    </Button>
                  </div>
                ))}
              <br></br>

              <Button className="add-btn">ADD ITEM</Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
