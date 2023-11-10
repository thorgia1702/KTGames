import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { notification } from "antd";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  notification.error({
    message: "Error",
    description: "Please login to play online games",
  });
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
