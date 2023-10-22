import React, { useState, useEffect } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

export default function Profile() {
  const [open, setOpen] = useState(undefined);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    point: 100,
  });

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showItemsError, setShowItemsError] = useState(false);
  const [items, setItems] = useState([]);

  console.log(formData);

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
    if (!formData.name || !formData.description || !formData.point) {
      notification.error({
        message: "Incomplete Information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    if (formData.imageUrls.length === 0) {
      notification.error({
        message: "Incomplete Information",
        description: "Please upload at least one image for the item.",
      });
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("api/item/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        const errorMessage = data.message;
        setError(errorMessage);
        showErrorModal("Item have already existed");
      } else {
        notification.success({
          message: "Success",
          description: "Item added successfully",
          
        });
      }
      showItems();
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      setLoading(false);
      showErrorModal(errorMessage);
    }
  };

  const showItems = async () => {
    try {
      setShowItemsError(false);
      const res = await fetch("api/item/items");
      const data = await res.json();
      if (data.success === false) {
        setShowItemsError(true);
        return;
      }
      setItems(data);
    } catch (error) {
      setShowItemsError(true);
    }
  };
  useEffect(() => {
    showItems();
  }, []);
  return (
    <div className="profile-page">
      <h1>Manage item</h1>

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
                value={formData.name}
                required
              ></input>

              <p>Item description:</p>
              <textarea
                type="text"
                placeholder="Item description"
                className="item_description"
                id="description"
                onChange={handleChange}
                value={formData.description}
              ></textarea>

              <p>Point:</p>
              <input
                type="number"
                className="item-information"
                min="100"
                max="10000"
                id="point"
                onChange={handleChange}
                value={formData.point}
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
                  {uploading ? "UPLOADING..." : "UPLOAD"}
                </Button>
              </div>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div key={url} className="uploaded-container">
                    <img src={url} alt="item image" className="uploaded-img" />
                    <Button
                      className="delete-uploaded"
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      DELETE
                    </Button>
                  </div>
                ))}
              <br></br>
              <Button
                className="add-btn"
                type="button"
                onClick={handleSubmit}
                disabled={loading || uploading}
              >
                {loading ? "ADDING..." : "ADD ITEM"}
              </Button>
            </form>
          </div>
        </Modal>
      </div>
      <div className="list-of-item">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <img src={item.imageUrls[0]} alt="item image" className="item-image"/>
            <p className="item-name">{item.name}</p>
            <div className="btn">
              <button className="delete-btn">DELETE</button>
              <button className="edit-btn">EDIT</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
