import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let hasRedirected = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshResponse = await axios.get(`${API_BASE_URL}/auth/refresh`, {
            withCredentials: true,
          })

          const newAccessToken = refreshResponse.data.accessToken
          localStorage.setItem('accessToken', newAccessToken)
          api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
        } catch (refreshError) {
          console.error('Refresh failed. Logging out...')

          if (!hasRedirected) {
            hasRedirected = true
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
          }

          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
      return api(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default api
