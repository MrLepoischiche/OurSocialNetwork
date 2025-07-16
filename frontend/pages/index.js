import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to Nexora Center</h1>
      <p>A Facebook-like social networking platform</p>
      
      <div className="auth-buttons">
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/register">
          <button>Register</button>
        </Link>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        .auth-buttons {
          margin-top: 2rem;
        }
        button {
          margin: 0 1rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
