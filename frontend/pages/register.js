import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('email', e.target.email.value.trim());
    formData.append('password', e.target.password.value.trim());
    formData.append('firstName', e.target.firstName.value.trim());
    formData.append('lastName', e.target.lastName.value.trim());
    formData.append('dateOfBirth', e.target.dob.value);
    formData.append('nickname', e.target.nickname.value.trim());
    formData.append('aboutMe', e.target.bio.value.trim());

    // Handle avatar file if implemented
    if (e.target.avatar && e.target.avatar.files.length > 0) {
      formData.append('avatar', e.target.avatar.files[0]);
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Registration failed');
        return;
      }

      const data = await response.json();
      setSuccess(data.message || 'Registration successful');
      // Optionally redirect to login page after registration
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="email" className="input-label">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Placeholder E-mail"
            className="register-input"
            required
          />
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="...................."
            className="register-input"
            required
          />
          <label htmlFor="firstName" className="input-label">First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Placeholder First name"
            className="register-input"
          />
          <label htmlFor="lastName" className="input-label">Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Placeholder Last name"
            className="register-input"
          />
          <div className="profile-section">
            <div className="profile-picture">
              Profile Picture
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                className="upload-input"
              />
            </div>
            <div className="dob-username">
              <label htmlFor="dob" className="input-label">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="dob-input"
                placeholder="0/0/0000"
              />
              <label htmlFor="nickname" className="input-label">Nickname/Username</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="Placeholder Nickname/Username"
                className="nickname-input"
              />
            </div>
          </div>
          <label htmlFor="bio" className="input-label">Bio/About ME</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Placeholder Bio/ About ME section"
            className="bio-textarea"
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        <div className="signin-link">
          Already have an Account? <Link href="/login">Sign in</Link>
        </div>
      </div>
      <div className="social-register">
        <div className="social-register-item">Register with GOOGLE</div>
        <div className="social-register-item">Register With Discord</div>
      </div>
    </div>
  );
};

export default Register;
