import React, { useState } from 'react'
import './pages.css'
import { notification, Alert, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <Alert className='alert_message' message={error} type="warning" showIcon />}
      <form onSubmit={handleSubmit} className="registerform">

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />
        </div>

        <button disabled={loading || !formData.email || !formData.password} className='submitbutton'>
          {loading ? 'LOADING...' : 'SIGN IN'}
        </button>

        <p className="login-register-guide">Don't have an account? <a href="/sign-up">Register here!</a></p>      
      </form>
    </div>
  )
}
