import axios from '../utils/axios'


let prefix = "/users"

// 身分驗證
export function checkAuth() { return axios.post(`${prefix}/auth`) }


// 取得所有活動
export function getAllEvents() { return axios.get(`/events`) }
//取得單一活動資訊
export function getEventInfo(eventId) { return axios.get(`/events/${eventId}`) }


// 取得收藏
export function getCollect() { return axios.get(`${prefix}/collect`) }
// 刪除/增加 手藏
export function patchCollect(eventId) { return axios.patch(`${prefix}/toggle-collect/${eventId}`) }

// 取得所有票卷
export function getAllOrder() { return axios.get(`/orders`) }
// 取得單一票卷資訊
export function getOrderInfo(orderId) { return axios.get(`/orders/${orderId}`) }

// 生成新訂單
export function newOrder(data) { return axios.post(`/orders/create`, data) }
// 取得訂單解果
export function getNewOrderInfo(orderId) { return axios.get(`/orders/${orderId}`) }
// 退票
export function refundTicket(orderId) { return axios.post(`/orders/${orderId}/refund`) }


// 取得使用者資訊
export function getProfile() { return axios.get(`${prefix}/profile`) }
// 變更名稱
export function updateProfile(data) { return axios.put(`${prefix}/profile`, data) }
// 修改密碼
export function updatePassword(data) { return axios.put(`${prefix}/password`, data) }

// 註冊
export function signup(data) { return axios.post(`${prefix}/signup`, data) }

// 登入
export function signin(data) { return axios.post(`${prefix}/signin`, data) }

// 取消綁定
export function cancleGoogleBind() { return axios.delete(`/google/bind`) }
// 綁定
export function setGoogleBind(url) { return axios.get(`/google/bind?redirectUri=${url}`) }

// 取額所有活動類型
export function getEventTypes() { return axios.get(`/event-types`) }
