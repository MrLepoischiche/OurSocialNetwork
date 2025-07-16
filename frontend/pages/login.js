import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login failed');
        return;
      }

      const data = await response.json();
      const token = data.token;

      // Store token securely - for now localStorage (consider httpOnly cookie in production)
      localStorage.setItem('token', token);

      setError('');
      // Redirect to mainpage after login
      router.push('/mainpage');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
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
          <label htmlFor="username" className="input-label">Email / Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your email"
            className="login-input"
            onChange={handleInputChange}
          />
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="login-input"
            onChange={handleInputChange}
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="register-link">
          Not registered yet? <Link href="/register">Register now</Link>
        </div>
      </div>
      <div className="social-login">
        <div className="social-login-item">Sign in With google</div>
        <div className="social-login-item">Sign in with Discord</div>
      </div>
    </div>
  );
};

export default Login;
