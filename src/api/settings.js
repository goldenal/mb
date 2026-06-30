import { get, put } from './client.js'

export const getSettings = () => get('/settings')
export const updateSettings = (data) => put('/settings', data)
