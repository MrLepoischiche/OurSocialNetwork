import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    // Simple validation example
    if (!username || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    // Simulate login failure for demonstration
    if (username !== 'user@example.com' || password !== 'password123') {
      setError('Incorrect username/email or password.');
      return;
    }

    setError('');
    // Proceed with successful login logic here
    alert('Login successful!');
  };

  const handleInputChange = () => {
    if (error) {
      setError('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="logo-circle">LOGO</div>
      </div>
      <div className="login-form-container">
        {error && <div className="error-message">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username" className="input-label">Username/e_mail</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Placeholder"
            className="login-input"
            onChange={handleInputChange}
          />
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="...................."
            className="login-input"
            onChange={handleInputChange}
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
