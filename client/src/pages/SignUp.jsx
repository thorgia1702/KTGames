import React, { useState } from "react";
import "./pages.css";
import { notification, Space } from "antd"; // Remove "Alert" from imports
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      notification.error({
        message: "Error",
        description: "Password must be at least 8 characters long",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);

        // Display the error message as a popup
        notification.error({
          message: "Error",
          description: "User already exists!, please choose another name or email",
        });

        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
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
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit} className="registerform">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            className="text_box"
            type="text"
            id="username"
            placeholder="Enter your name"
            onChange={handleChange}
          />
        </div>

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
          disabled={
            loading ||
            !formData.username ||
            !formData.email ||
            !formData.password
          }
          className="submitbutton"
        >
          {loading ? "LOADING..." : "SIGN UP"}
        </button>

        <Oauth />

        <p className="login-register-guide">
          Already have an account? <a href="/sign-in">Login here!</a>
        </p>
      </form>
    </div>
  );
}
