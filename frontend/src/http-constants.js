import axios from 'axios'

let baseURL

baseURL = 'http://192.168.0.106:3000'

export default baseURL
export const HTTP = axios.create(
  {
    baseURL: baseURL
  })
