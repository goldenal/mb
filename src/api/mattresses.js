import { get, post, put, del } from './client.js'

export const getMattresses = () => get('/mattresses')
export const getMattress = (id) => get(`/mattresses/${id}`)
export const createMattress = (formData) => post('/mattresses', formData)
export const updateMattress = (id, formData) => put(`/mattresses/${id}`, formData)
export const deleteMattress = (id) => del(`/mattresses/${id}`)
export const reorderMattresses = (ids) => put('/mattresses/reorder', { ids })
