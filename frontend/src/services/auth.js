import api from './api'

export const loginRequest = (username, password) =>
  api.post('/auth/login', { username, password })

export const getMeRequest = () =>
  api.get('/auth/me')
