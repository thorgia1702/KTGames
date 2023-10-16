import React, { useState } from "react";
import "./pages.css";
import { notification, Space } from "antd"; // Remove "Alert" from imports
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInSuccess,
  signInStart,
} from "../redux/user/userSlice";
import Oauth from "../components/Oauth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));

        // Display the error message as a popup
        notification.error({
          message: "Error",
          description: data.message,
        });

        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      // Display the error message as a popup
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit} className="registerform">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            className="text_box"
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="text_box"
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading || !formData.email || !formData.password}
          className="submitbutton"
        >
          {loading ? "LOADING..." : "SIGN IN"}
        </button>

        <Oauth />

        <p className="login-register-guide">
          Don't have an account? <a href="/sign-up">Register here!</a>
        </p>
      </form>
    </div>
  );
}
