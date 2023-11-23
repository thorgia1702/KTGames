import React, { useState, useEffect } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";

export default function Update_order() {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    address: "",
    phone: "",
    email: "",
    productId: "",
    productName: "",
    orderDate: "",
    orderStatus: "",
  });

  const showErrorModal = (errorMessage) => {
    Modal.error({
      title: "Error",
      content: errorMessage,
      centered: true,
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
      navigate("/orders");
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
    navigate("/orders");
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = params.orderId;
      const res = await fetch(`/api/order/get/${orderId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    showModal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/order/update/${params.orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        const errorMessage = data.message;
        setError(errorMessage);
        showErrorModal("Order status update failed");
        showErrorModal(data.message);
      } else {
        notification.success({
          message: "Success",
          description: "Order status updated successfully",
        });
        navigate("/orders");
      }
    } catch (error) {
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
        title="Order details"
        centered
        width={650}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="order-container">
          <form className="order-info" onSubmit={handleSubmit}>
            <p className="order_information">UserName: {formData.userName}</p>
            <p className="order_information">Phone number: {formData.phone}</p>
            <p className="order_information">Email: {formData.email}</p>
            <p className="order_information">Address: {formData.address}</p>
            <p className="order_information">Product: {formData.productName}</p>
            <p className="order_information">
              Order Date: {formData.orderDate}
            </p>
            <p className="order_information">Order Status:</p>
            <select
              className="order_status"
              value={formData.orderStatus}
              onChange={(e) =>
                setFormData({ ...formData, orderStatus: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </select>

            <button type="submit" disabled={loading} className="updatebtn">
              {loading ? "LOADING..." : "UPDATE"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
