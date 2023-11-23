import React, { useState, useEffect } from "react";
import "../pages.css";
import "./admin.css";
import { Button, Modal, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";

export default function Update_order() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    point: 100,
  });

  return (
    <div>Update_order</div>
  )
}
