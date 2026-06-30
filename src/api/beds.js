import { get, post, put, del } from './client.js'

export const getBeds = () => get('/beds')
export const getBed = (id) => get(`/beds/${id}`)
export const createBed = (formData) => post('/beds', formData)
export const updateBed = (id, formData) => put(`/beds/${id}`, formData)
export const deleteBed = (id) => del(`/beds/${id}`)
export const reorderBeds = (ids) => put('/beds/reorder', { ids })
