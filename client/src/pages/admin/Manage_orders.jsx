import React, { useState, useEffect } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";
import { Link } from "react-router-dom";

export default function Manage_orders() {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrdersError, setShowOrdersError] = useState(false);

  const showErrorModal = (errorMessage) => {
    Modal.error({
      title: "Error",
      content: errorMessage,
      centered: true,
    });
  };

  const showOrders = async () => {
    try {
      setShowOrdersError(false);
      const res = await fetch("api/order/orders");
      const data = await res.json();
      if (data.success === false) {
        setShowOrdersError(true);
        return;
      }
      setOrders(data);
    } catch (error) {
      setShowOrdersError(true);
    }
  };

  useEffect(() => {
    showOrders();
  }, []);

  const handleDeleteOrder = (OrderId) => {
    setDeleteConfirmation(true);
    setDeleteOrderId(OrderId);
  };

  const confirmDelete = async () => {
    if (deleteOrderId) {
      try {
        const res = await fetch(`/api/order/delete/${deleteOrderId}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success === false) {
          const errorMessage = data.message;
          setError(errorMessage);
          showErrorModal(data.message);
        } else {
          notification.success({
            message: "Success",
            description: "Order deleted successfully",
          });
          setDeleteConfirmation(false);
          setDeleteOrderId(null);
          showOrders();
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
    setDeleteOrderId(null);
  };

  return (
    <div>
      <h1>Manage orders</h1>
      <div className="list-of-orders">
        <table>
          <thead>
            <tr>
              <th>Order Date</th>
              <th>Product name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderDate}</td>
                <td>{order.productName}</td>
                <td>{order.address}</td>
                <td>{order.phone}</td>
                <td>{order.email}</td>
                <td
                  id={
                    order.orderStatus === "Pending"
                      ? "order_pending"
                      : order.orderStatus === "Approved"
                      ? "order_approved"
                      : "order_rejected"
                  }
                >
                  {order.orderStatus}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="delete-btn"
                  >
                    DELETE
                  </button>
                  <Link to={`/update-order/${order._id}`}>
                    <button className="edit-btn">Detail</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Confirm Deletion"
        open={deleteConfirmation}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        centered
      >
        <p>Are you sure you want to delete this order?</p>
      </Modal>
    </div>
  );
}
