import axios from 'axios'

const instance = axios.create({
  baseURL:`http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT || '5000'}`,
  timeout:2000,
})

export default instance