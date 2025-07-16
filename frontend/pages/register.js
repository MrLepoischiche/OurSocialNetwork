import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nickname: '',
    aboutMe: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Try with FormData first
      const formDataToSend = new FormData()
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value)
        }
      })
      
      // Add avatar if exists
      if (avatar) {
        formDataToSend.append('avatar', avatar)
      }

      console.log('Submitting registration with FormData')
      
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header for FormData
        credentials: 'include',
      })

      // If response is not ok, try with JSON instead
      if (!response.ok && response.status === 400) {
        console.log('FormData approach failed, trying JSON')
        
        // Create JSON payload (excluding the file)
        const jsonData = { ...formData }
        
        const jsonResponse = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
          credentials: 'include',
        })
        
        if (!jsonResponse.ok) {
          const errorData = await jsonResponse.json().catch(() => ({ 
            message: `Registration failed with status: ${jsonResponse.status}` 
          }))
          throw new Error(errorData.message || 'Registration failed')
        }
        
        const data = await jsonResponse.json()
        localStorage.setItem('token', data.token)
        router.push('/')
        return
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Registration failed with status: ${response.status}` 
        }))
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Register</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password*</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <small>Password must be at least 6 characters</small>
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name*</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name*</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth*</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar</label>
          <input
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />
          <small>Optional: Upload a profile picture</small>
        </div>
        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
          <small>Optional: Choose a unique nickname</small>
        </div>
        <div className="form-group">
          <label htmlFor="aboutMe">About Me</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
          />
          <small>Optional: Tell us about yourself</small>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <a href="/login" className="return">
          Already have an account? Login
        </a>
      </form>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        input, textarea {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        small {
          display: block;
          color: #666;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        textarea {
          min-height: 100px;
        }
        button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
          font-size: 1rem;
          width: 100%;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #d32f2f;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: #ffebee;
          border-radius: 4px;
          border-left: 4px solid #d32f2f;
        }
        .return {
          display: block;
          margin-top: 1rem;
          text-align: center;
          color: #0070f3;
          text-decoration: none;
        }
        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  )
}