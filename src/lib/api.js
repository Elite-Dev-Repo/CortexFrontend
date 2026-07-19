import axios from "axios"
import { ACCESS, REFRESH } from "./constants"

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem(REFRESH)

      if (!refreshToken) {
        isRefreshing = false
        localStorage.removeItem(ACCESS)
        localStorage.removeItem(REFRESH)
        window.location.href = "/auth"
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        })

        localStorage.setItem(ACCESS, data.access)
        processQueue(null, data.access)

        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem(ACCESS)
        localStorage.removeItem(REFRESH)
        window.location.href = "/auth"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
