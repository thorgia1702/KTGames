import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { notification } from "antd";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    notification.error({
      message: "Error",
      description: "Please sign in to continue",
    });
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
}
