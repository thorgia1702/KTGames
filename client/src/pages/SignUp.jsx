import React from 'react'
import './pages.css'

export default function SignUp() {
  return (
    <div>
      <h1>Register</h1>
      <form className="registerform">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>

        <button className='submitbutton' type="submit">SIGN UP</button>
        <p className="login-register-guide">Already have an account? <a href="/sign-in">Login here!</a></p>
      </form>

    </div>
  )
}
