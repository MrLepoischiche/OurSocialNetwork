import { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nickname: '',
    aboutMe: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try with FormData first
      const formDataToSend = new FormData();

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Add avatar if exists
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      console.log('Submitting registration with FormData');

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header for FormData
        credentials: 'include',
      });

      // If response is not ok, try with JSON instead
      if (!response.ok && response.status === 400) {
        console.log('FormData approach failed, trying JSON');

        // Create JSON payload (excluding the file)
        const jsonData = { ...formData };

        const jsonResponse = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
          credentials: 'include',
        });

        if (!jsonResponse.ok) {
          const errorData = await jsonResponse.json().catch(() => ({
            message: `Registration failed with status: ${jsonResponse.status}`
          }));
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await jsonResponse.json();
        localStorage.setItem('token', data.token);
        // Using window.location.href for navigation as router is Next.js specific
        window.location.href = '/';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Registration failed with status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      // Using window.location.href for navigation as router is Next.js specific
      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Register Form</h1> {/* Moved H1 here */}
      {error && <div className="error-message">{error}</div>}

      <div className="form-layout">
        {/* Left Column - Register Form */}
        <div className="form-column">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Placeholder E-mail"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="************"
              />
              <small>Password must be at least 6 characters</small>
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Placeholder First name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Placeholder Last name"
              />
            </div>

            <div className="profile-date-group">
              <div className="profile-picture-group">
                <label htmlFor="avatar">Profile Picture</label>
                <div className="avatar-placeholder">
                  {avatar ? (
                    <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="avatar-preview" />
                  ) : (
                    <div className="avatar-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                  )}
                  <input
                    id="avatar"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="avatar-input"
                  />
                </div>
                <small>Optional: Upload a profile picture</small>
              </div>

              <div className="form-group date-of-birth">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nickname">Nickname/Username</label>
              <input
                id="nickname"
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Placeholder Nickname/Username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="aboutMe">Bio/About ME</label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Placeholder Bio/About ME section"
                rows="4"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <a href="/login" className="return-link">
            Already have an account? <span className="sign-in-text">Sign in</span>
          </a>
        </div>

        {/* Vertical Separator */}
        <div className="vertical-separator"></div>

        {/* Right Column - Register With */}
        <div className="social-login-column">
          <h3>Register With</h3>
          <div className="social-buttons">
            <button key="register-google" className="social-button">
              Register with GOOGLE
            </button>
            <button key="register-discord" className="social-button">
              Register With discord
            </button>
            {/* Add more social login buttons as needed */}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background-color: #f3f4f6; /* bg-gray-100 */
          display: flex;
          flex-direction: column; /* Added to stack h1 above form-layout */
          align-items: center;
          justify-content: center;
          padding: 1rem; /* p-4 */
          font-family: sans-serif; /* Fallback for font-inter */
        }

        .form-layout {
          background-color: #ffffff; /* bg-white */
          padding: 2rem; /* p-8 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          width: 100%;
          max-width: 960px; /* max-w-4xl */
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) { /* md:flex-row */
          .form-layout {
            flex-direction: row;
          }
        }

        .form-column {
          flex: 1; /* flex-1 */
          padding-right: 0;
        }

        @media (min-width: 768px) { /* md:pr-8 */
          .form-column {
            padding-right: 2rem;
          }
        }

        h1 {
          text-align: center;
          font-size: 1.5rem; /* text-xl */
          font-weight: 600; /* font-semibold */
          margin-bottom: 1.5rem; /* mb-6 */
          color: #374151; /* text-gray-800 */
        }

        .error-message {
          background-color: #fee2e2; /* bg-red-100 */
          border: 1px solid #ef4444; /* border-red-400 */
          color: #b91c1c; /* text-red-700 */
          padding: 0.75rem 1rem; /* px-4 py-3 */
          border-radius: 0.375rem; /* rounded-md */
          margin-bottom: 1rem; /* mb-4 */
        }

        .form-group {
          margin-bottom: 1rem; /* mb-4 */
        }

        label {
          display: block;
          color: #4b5563; /* text-gray-700 */
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          margin-bottom: 0.25rem; /* mb-1 */
        }

        input, textarea {
          width: 100%;
          padding: 0.5rem 1rem; /* px-4 py-2 */
          border: 1px solid #d1d5db; /* border border-gray-300 */
          border-radius: 9999px; /* rounded-full */
          outline: none;
          color: #4b5563; /* text-gray-700 */
        }
        input::placeholder, textarea::placeholder {
          color: #9ca3af; /* placeholder-gray-400 */
        }
        input:focus, textarea:focus {
          border-color: #3b82f6; /* focus:ring-blue-500 */
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 */
        }

        textarea {
          border-radius: 0.5rem; /* rounded-lg */
          resize: vertical; /* resize-y */
        }

        small {
          display: block;
          color: #6b7280; /* text-gray-500 */
          font-size: 0.75rem; /* text-xs */
          margin-top: 0.25rem; /* mt-1 */
          margin-left: 0.5rem; /* ml-2 */
        }

        .profile-date-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem; /* mb-4 */
          align-items: center;
        }

        @media (min-width: 768px) { /* md:flex-row md:space-x-4 */
          .profile-date-group {
            flex-direction: row;
            align-items: center;
            margin-left: -1rem; /* compensate for space-x-4 */
            margin-right: -1rem; /* compensate for space-x-4 */
          }
          .profile-date-group > div {
            margin-left: 1rem;
            margin-right: 1rem;
          }
        }

        .profile-picture-group {
          flex-shrink: 0; /* flex-shrink-0 */
          margin-bottom: 1rem; /* mb-4 */
        }

        @media (min-width: 768px) { /* md:mb-0 */
          .profile-picture-group {
            margin-bottom: 0;
          }
        }

        .avatar-placeholder {
          position: relative;
          width: 7rem; /* w-28 */
          height: 7rem; /* h-28 */
          border-radius: 9999px; /* rounded-full */
          background-color: #e5e7eb; /* bg-gray-200 */
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }

        .avatar-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-icon {
          width: 2.5rem; /* w-10 */
          height: 2.5rem; /* h-10 */
          color: #9ca3af; /* text-gray-400 */
          font-size: 3.75rem; /* text-6xl */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .date-of-birth {
          flex: 1; /* flex-1 */
          width: 100%;
        }

        button[type="submit"] {
          width: 100%;
          background-color: #d1d5db; /* bg-gray-300 */
          color: #374151; /* text-gray-800 */
          font-weight: 700; /* font-bold */
          padding: 0.5rem 1rem; /* py-2 px-4 */
          border-radius: 9999px; /* rounded-full */
          border: none;
          cursor: pointer;
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform; /* transition */
          transition-duration: 300ms; /* duration-300 */
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out */
        }

        button[type="submit"]:hover {
          background-color: #9ca3af; /* hover:bg-gray-400 */
        }
        button[type="submit"]:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5); /* focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 */
        }
        button[type="submit"]:disabled {
          background-color: #e5e7eb; /* bg-gray-200 */
          cursor: not-allowed;
        }

        .return-link {
          display: block;
          text-align: center;
          color: #2563eb; /* text-blue-600 */
          text-decoration: none;
          margin-top: 1rem; /* mt-4 */
          font-size: 0.875rem; /* text-sm */
        }
        .return-link:hover {
          text-decoration: underline; /* hover:underline */
        }
        .sign-in-text {
          font-weight: 600; /* font-semibold */
        }

        .vertical-separator {
          display: none; /* hidden */
          width: 1px; /* w-px */
          background-color: #d1d5db; /* bg-gray-300 */
          margin: 0 2rem; /* mx-8 */
        }

        @media (min-width: 768px) { /* md:block */
          .vertical-separator {
            display: block;
          }
        }

        .social-login-column {
          flex: 1; /* flex-1 */
          margin-top: 2rem; /* mt-8 */
        }

        @media (min-width: 768px) { /* md:mt-0 md:pl-8 */
          .social-login-column {
            margin-top: 0;
            padding-left: 2rem;
          }
        }

        .social-login-column h3 {
          font-size: 1.125rem; /* text-lg */
          font-weight: 600; /* font-semibold */
          margin-bottom: 1rem; /* mb-4 */
          color: #374151; /* text-gray-800 */
        }

        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* space-y-4 */
        }

        .social-button {
          width: 100%;
          background-color: #e5e7eb; /* bg-gray-200 */
          color: #4b5563; /* text-gray-700 */
          font-weight: 500; /* font-medium */
          padding: 0.5rem 1rem; /* py-2 px-4 */
          border-radius: 9999px; /* rounded-full */
          border: none;
          cursor: pointer;
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform; /* transition */
          transition-duration: 300ms; /* duration-300 */
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out */
        }

        .social-button:hover {
          background-color: #d1d5db; /* hover:bg-gray-300 */
        }
        .social-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.5); /* focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 */
        }
      `}</style>
    </div>
  );
}
