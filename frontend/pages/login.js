import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      router.push('/HomePage')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="container">
      <div className="login-form-wrapper">
        <div className="logo-section">
          <div className="logo-circle">
          </div>
        </div>
        <div className="form-section">
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email" className="input-label">Username/e_mail</label>
            <input
              id="email"
              type="email"
              placeholder="Placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field password-field"
            />
            <button type="submit" className="login-button">Login</button>
            <p className="register-text">
              Not register yet : <a href="/register" className="register-link">register now</a>
            </p>
          </form>
        </div>
        <div className="social-section">
          <div className="vertical-line"></div>
          <div className="social-buttons">
            <button className="social-button google-button">Sign in with GOOGLE</button>
            <button className="social-button discord-button">Sign in with Discord</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          background-color: white;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
          color: black;
        }
        .login-form-wrapper {
          display: flex;
          width: 900px;
          height: 400px;
          background-color: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          padding: 20px;
          align-items: center;
          justify-content: space-between;
        }
        .logo-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logo-circle {
          width: 150px;
          height: 150px;
          background-color: #b0b0b0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logo-image {
          max-width: 80px;
          max-height: 80px;
        }
        .form-section {
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .input-label {
          font-size: 12px;
          margin-bottom: 5px;
        }
        .input-field {
          height: 40px;
          border-radius: 15px;
          border: none;
          background-color: #b0b0b0;
          padding: 0 15px;
          font-size: 14px;
          outline: none;
        }
        .input-field:focus {
          outline: 2px solid #00bfa5;
          background-color: white;
        }
        .password-field {
          border: 1px solid #00bfa5;
          background-color: white;
        }
        .login-button {
          width: 100px;
          height: 30px;
          border-radius: 15px;
          border: none;
          background-color: #b0b0b0;
          cursor: pointer;
          font-size: 14px;
          align-self: center;
        }
        .register-text {
          font-size: 12px;
          text-align: center;
          margin-top: 10px;
        }
        .register-link {
          color: blue;
          text-decoration: underline;
          cursor: pointer;
        }
        .social-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .vertical-line {
          width: 1px;
          height: 200px;
          background-color: #b0b0b0;
        }
        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 20px;
          font-size: 12px;
        }
        .social-button {
          background-color: #b0b0b0;
          border: none;
          border-radius: 15px;
          height: 30px;
          cursor: pointer;
          width: 120px;
          text-align: center;
        }
        .google-button {
          /* Additional styling for Google button if needed */
        }
        .discord-button {
          /* Additional styling for Discord button if needed */
        }
      `}</style>
    </div>
  )
}
