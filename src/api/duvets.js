import { get, post, put, del } from './client.js'

export const getDuvets = () => get('/duvets')
export const getDuvet = (id) => get(`/duvets/${id}`)
export const createDuvet = (formData) => post('/duvets', formData)
export const updateDuvet = (id, formData) => put(`/duvets/${id}`, formData)
export const deleteDuvet = (id) => del(`/duvets/${id}`)
export const reorderDuvets = (ids) => put('/duvets/reorder', { ids })
