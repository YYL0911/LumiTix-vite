import axios from '../utils/axios'


let prefix = "/admin"


// 取得所有活動
export function getAllEvents() { return axios.get(`${prefix}/events`) }

export function getAllUsers() { return axios.get(`${prefix}/users`) }

export function blockUser(userId) { return axios.patch(`${prefix}/users/${userId}/toggle-block`) }

export function getUserInfo(userId) { return axios.get(`${prefix}/users/${userId}`) }

export function getEventInfo(eventId) { return axios.get(`${prefix}/events/${eventId}`) }

export function patchEvent(eventId, data) { return axios.patch(`${prefix}/events/${eventId}`, data) }

export function getRevenue(eventId) { return axios.get(`${prefix}/events/revenue/${eventId}`) }
