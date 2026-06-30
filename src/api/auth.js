import { get, post, put } from './client.js'

export const login = (email, password) => post('/auth/login', { email, password })
export const setup = (email, password, name) => post('/auth/setup', { email, password, name })
export const getMe = () => get('/auth/me')
export const changePassword = (currentPassword, newPassword) =>
  put('/auth/password', { currentPassword, newPassword })
