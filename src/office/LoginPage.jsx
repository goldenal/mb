import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, setup as setupApi } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (token) {
    navigate('/office', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const { token: t, admin } = await loginApi(email, password)
        login(t, admin)
        navigate('/office', { replace: true })
      } else {
        const { token: t, admin } = await setupApi(email, password, name)
        login(t, admin)
        navigate('/office', { replace: true })
      }
    } catch (err) {
      if (mode === 'login' && err.message.includes('Invalid')) {
        setError('Invalid email or password.')
      } else if (err.message.includes('already set up')) {
        setError('Admin already exists. Please log in instead.')
        setMode('login')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="office-login-wrap">
      <div className="office-login-card">
        <div className="office-login-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"></path>
            <path d="M3 18h18"></path>
            <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Mature Beddings Office</span>
        </div>

        <h1>{mode === 'login' ? 'Sign in' : 'Create admin account'}</h1>

        <form onSubmit={handleSubmit} className="office-login-form">
          {mode === 'setup' && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'setup' ? 'Min. 8 characters' : '••••••••'}
              minLength={mode === 'setup' ? 8 : undefined}
              required
            />
          </div>
          {error && <p className="office-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          className="office-login-switch"
          onClick={() => { setMode(mode === 'login' ? 'setup' : 'login'); setError(null) }}
        >
          {mode === 'login' ? 'First time? Set up admin account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
