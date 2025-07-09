import React from 'react';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="logo-circle">LOGO</div>
      </div>
      <div className="login-form-container">
        <form className="login-form">
          <label htmlFor="username" className="input-label">Username/e_mail</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Placeholder"
            className="login-input"
          />
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="...................."
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="register-link">
          Not register yet : <Link href="/register">register now</Link>
        </div>
      </div>
      <div className="social-login">
        <div className="social-login-item">Sign in With GOOGLE</div>
        <div className="social-login-item">Sign in with Discord</div>
      </div>
    </div>
  );
};

export default Login;
