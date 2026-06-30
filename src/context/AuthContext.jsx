import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('office_token'))
  const [admin, setAdmin] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!token) {
      setReady(true)
      return
    }
    getMe()
      .then(({ admin }) => setAdmin(admin))
      .catch(() => {
        localStorage.removeItem('office_token')
        setToken(null)
      })
      .finally(() => setReady(true))
  }, [token])

  function login(newToken, adminData) {
    localStorage.setItem('office_token', newToken)
    setToken(newToken)
    setAdmin(adminData)
  }

  function logout() {
    localStorage.removeItem('office_token')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ token, admin, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
