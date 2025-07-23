import axios from '../utils/axios'


let prefix = "/organizer"




// 取得所有活動
export function getAllEvents() { return axios.get(`${prefix}/events`) }


export function cancleEvents(eventId) { return axios.delete(`${prefix}/events/${eventId}`) }

export function getHoldingEvent() { return axios.get(`${prefix}/events/by-status?status=holding`) }

export function scanResult(eventId, tokenData) { 
    return axios.patch(`${prefix}/events/${eventId}/verify/?token=${tokenData}`) 
}


//取得單一活動資訊
export function getEventInfo(eventId) { return axios.get(`${prefix}/events/${eventId}`) }


export function uploadPic(data) { return axios.post(`${prefix}/upload_image`, data) }

export function updateEvent(data) { return axios.put(`${prefix}/events/${eventId}`, data) }
export function newEvent(data) { return axios.post(`${prefix}/propose-event`, data) }



