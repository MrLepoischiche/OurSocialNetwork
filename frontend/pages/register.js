import React from 'react';
import Link from 'next/link';

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-form-container">
        <form className="register-form">
          <label htmlFor="email" className="input-label">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Placeholder E-mail"
            className="register-input"
          />
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="...................."
            className="register-input"
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
              <button type="button" className="upload-button">+</button>
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
          Already have a Account : <Link href="/login">sign in</Link>
        </div>
      </div>
      <div className="social-register">
        <div className="social-register-item">Register with GOOGLE</div>
        <div className="social-register-item">Register With discord</div>
      </div>
    </div>
  );
};

export default Register;
