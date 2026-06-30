import { get, post, put, del } from './client.js'

export const getStores = () => get('/stores')
export const getStore = (id) => get(`/stores/${id}`)
export const createStore = (data) => post('/stores', data)
export const updateStore = (id, data) => put(`/stores/${id}`, data)
export const deleteStore = (id) => del(`/stores/${id}`)
export const reorderStores = (ids) => put('/stores/reorder', { ids })
