import React, { useState } from "react";
import "../pages.css";
import "./admin.css"
import { useSelector } from "react-redux";
import { Button, Modal, notification } from "antd";
import { useEffect } from "react";


export default function Profile() {
  const [setLoading] = useState(false);
  const [open, setOpen] = useState(undefined);
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

              <p>Item Image:</p>
              <input
                type="file"
                className="item-information"
                id="image"
                onChange={handleChange}
              ></input>
              
              <br></br>
              <Button disabled={
            !formData.name ||
            !formData.description ||
            !formData.point ||
            !formData.image
          } className="add-btn">
              ADD ITEM
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
