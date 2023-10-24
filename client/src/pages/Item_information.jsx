import React, { useState, useEffect } from "react";
import "./pages.css";
import { Button, Modal, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Item_information() {
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    point: "",
  });

  const navigate = useNavigate();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      navigate("/ktshop");
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
    navigate("/ktshop");
  };

  useEffect(() => {
    showModal();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      const itemId = params.itemId;
      const res = await fetch(`/api/item/get/${itemId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchItem();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        title={formData.name.toUpperCase()}
        centered
        width={1000}
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
          navigate("/ktshop");
        }}
        className="my-modal"
        footer={[]}
      >
        <div className="form-container">
          <form className="item-inform">
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div key={url} className="img-ctn">
                  <img src={url} alt="item image" className="img" />
                </div>
              ))}
            <div className="in4-ctn">
              <p className="item-in4">Item name:</p>
              <p className="item-in4" id="name">
                ㅤ{formData.name}
              </p>

              <p className="item-in4">Item description:</p>
              <p className="item-in4" id="description">
                ㅤ{formData.description}
              </p>

              <p className="item-in4" id="point">
                KT Points Required: {formData.point}
              </p>
              <p className="item-in4" id="user-point">
                Current KT Points: {currentUser.ktpoint}
              </p>
              <p className="item-in4" id="after-point">
                {currentUser.ktpoint - formData.point < 0
                  ? "KT Points not enough to order this item"
                  : `KT Points after order: ${
                      currentUser.ktpoint - formData.point
                    }`}
              </p>
              <Button
                className="order-btn"
                disabled={currentUser.ktpoint < formData.point}
              >
                Order
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
