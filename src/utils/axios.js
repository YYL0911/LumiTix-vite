// src/utils/axios.js
import axios from 'axios'
import { getAuthToken } from './token'
import Swal from "sweetalert2";

// 建立 axios 實例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://n7-backend.onrender.com/api/v1', // 可用 Vite 環境變數
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器（例如自動加 token）
instance.interceptors.request.use(
  config => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 回應攔截器（可統一錯誤處理）
instance.interceptors.response.use(
  response => {
    return response.data // 只回傳資料部分
  },
  async error => {
    const { response } = error
    if (response) {

        switch (response.data.message) {
            case "使用者已被封鎖":
                await Swal.fire({
                title: "帳號已被封鎖",
                text: "您的帳號因違反使用條款已被停權，如有疑問請聯繫客服。",
                icon: "error",
                confirmButtonText: "了解",
                })

                return Promise.reject({ type: 'BLOCKED', message: '帳號被封鎖', route:'/', raw: error })
            
            case "尚未登入":
                await Swal.fire({
                title: "尚未登入",
                text: "確認後跳轉至登入頁",
                icon: "warning",
                confirmButtonText: "確認",
                })

                return Promise.reject({ type: 'UNLOGIN', message: '尚未登入', route:'/login', raw: error })

            case "發生伺服器錯誤":
                await Swal.fire({
                title: "發生伺服器錯誤",
                icon: "error",
                confirmButtonText: "確認",
                })

                return Promise.reject({ type: 'SEVER', message: '伺服器錯誤', route:'/', raw: error })
            default:
                return Promise.reject({ type: 'OTHER', message: response.data?.message || '發生錯誤', route:'/', raw: error })
        }
    } else {
      alert('無法連線到伺服器')
      return Promise.reject({ type: 'Connect', message: response.data?.message || '發生錯誤', route:'/ErrorPage', raw: error })
    }
  }
)

export default instance
