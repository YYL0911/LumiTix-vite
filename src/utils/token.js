// src/utils/token.js
let getToken = () => null

export const setTokenGetter = (fn) => {
  getToken = fn
}

export const getAuthToken = () => getToken()
