import { get, post, put, del } from './client.js'

export const getPillows = () => get('/pillows')
export const getFeaturedPillows = () => get('/pillows?featured=true')
export const getPillow = (slug) => get(`/pillows/${slug}`)
export const createPillow = (formData) => post('/pillows', formData)
export const updatePillow = (id, formData) => put(`/pillows/${id}`, formData)
export const deletePillow = (id) => del(`/pillows/${id}`)
export const reorderPillows = (ids) => put('/pillows/reorder', { ids })
export const setFeaturedPillows = (slugs) => put('/pillows/featured', { slugs })
