const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('office_token')
  const headers = { ...options.headers }

  if (token) headers['Authorization'] = `Bearer ${token}`

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const data = await res.json()
      message = data.error || data.message || message
    } catch {
      // ignore parse failure
    }
    throw new Error(message)
  }

  return res.json()
}

export const get = (path) => request(path)
export const post = (path, body) =>
  request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) })
export const put = (path, body) =>
  request(path, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) })
export const del = (path) => request(path, { method: 'DELETE' })
