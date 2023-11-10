import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { notification } from "antd";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser || currentUser.role !== "admin") {
    notification.error({
      message: "Error",
      description: "Unauthorized",
    });
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
}
