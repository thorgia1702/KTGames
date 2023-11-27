import React, { useState, useEffect } from "react";
import "./pages.css";
import { Button, Modal, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

export default function Item_information() {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    point: "",
  });

  const showModal = () => {
    setOpen(true);
  };

  const showOrderModal = () => {
    setOrderModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      navigate("/ktshop");
    }, 3000);
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

  const [orderData, setOrderData] = useState({
    userId: currentUser._id,
    userName: currentUser.username,
    address: "",
    phone: currentUser.phone,
    email: currentUser.email,
    productId: params.itemId,
    productName: "",
    orderDate: "",
    orderStatus: "Pending",
  });

  const handleChange = (e) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      [e.target.id]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (
      !orderData.address ||
      !orderData.userName ||
      !orderData.phone ||
      !orderData.email
    ) {
      notification.error({
        message: "Error",
        description: "Please fill all the blanks",
      });
      return;
    }
    if (!/^\d{10}$/.test(orderData.phone)) {
      notification.error({
        message: "Error",
        description: "Phone number must be a 10-digit number",
      });
      return;
    }
    const currentDate = new Date();
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(currentDate);

    const updatedOrderData = {
      ...orderData,
      orderDate: formattedDateTime,
      productName: formData.name,
    };

    setOrderData(updatedOrderData);

    const newKtPoints = currentUser.ktpoint - formData.point;
    try {
      setLoading(true);
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrderData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        notification.error({
          message: "Error",
          description: "Can not place order, please try again",
        });
        return;
      }

      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ktpoint: newKtPoints,
          }),
        });
        const ms = await res.json();
        if (ms.success === false) {
          dispatch(updateUserFailure(ms.message));
          return;
        }
        dispatch(updateUserSuccess(ms));
        setUpdateSuccess(true);
        notification.success({
          message: "Success",
          description: "Your order has been placed successfully",
        });
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        notification.error({
          message: "Error",
          description: error.message,
        });
      }

      setLoading(false);
      setError(null);
      navigate("/ktshop");
    } catch (error) {
      setLoading(false);
      setError(error.message);

      // Display the error message as a popup
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

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
                onClick={showOrderModal}
              >
                Create Order
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={orderModalOpen}
        title="Order Information"
        centered
        width={700}
        onCancel={() => setOrderModalOpen(false)}
        footer={null}
      >
        <h2>{formData.name.toUpperCase()}</h2>
        <p>Name:</p>
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="edit-text"
          id="userName"
          onChange={handleChange}
        ></input>
        <p>Address:</p>
        <input
          type="text"
          placeholder="Address"
          className="edit-text"
          id="address"
          onChange={handleChange}
        ></input>
        <p>Phone:</p>
        <input
          type="text"
          placeholder="Phone number"
          defaultValue={currentUser.phone}
          className="edit-text"
          id="phone"
          onChange={handleChange}
        ></input>
        <p>Email:</p>
        <input
          type="text"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="edit-text"
          id="email"
          onChange={handleChange}
        ></input>
        <Button
          disabled={loading}
          className="order_button"
          onClick={handlePlaceOrder}
        >
          Place order
        </Button>
      </Modal>
    </div>
  );
}
