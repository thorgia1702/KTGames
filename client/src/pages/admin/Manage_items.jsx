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
import { Link } from "react-router-dom";

export default function Profile() {
  const [open, setOpen] = useState(undefined);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
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

  const handleDeleteItem = (itemId) => {
    setDeleteConfirmation(true);
    setDeleteItemId(itemId);
  };

  const confirmDelete = async () => {
    if (deleteItemId) {
      try {
        const res = await fetch(`/api/item/delete/${deleteItemId}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success === false) {
          const errorMessage = data.message;
          setError(errorMessage);
          showErrorModal("Item deletion failed");
        } else {
          notification.success({
            message: "Success",
            description: "Item deleted successfully",
          });
          setDeleteConfirmation(false);
          setDeleteItemId(null);
          showItems();
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
    setDeleteItemId(null);
  };

  return (
    <div className="list-of-items">
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
                      disabled={loading || uploading}
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
        <div className="column-header">
          <p className="item-name">ㅤㅤImage</p>
          <p className="item-name">Name</p>
          <p className="item-name">Point</p>
          <p className="item-description">Description</p>
          <p className="item-name">ㅤㅤAction</p>
        </div>
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <img
              src={item.imageUrls[0]}
              alt="item image"
              className="item-image"
            />
            <p className="item-name">{item.name}</p>
            <p className="item-name">{item.point}</p>
            <p className="item-description">{item.description}</p>
            <div className="btn">
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="delete-btn"
              >
                DELETE
              </button>
              <Link to={`/update-item/${item._id}`}>
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
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </div>
  );
}
