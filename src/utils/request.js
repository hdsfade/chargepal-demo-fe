import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '', // url = base url + request url
  timeout: 15 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (process.env.NODE_ENV === 'development') { 

    if (process.env.NODE_ENV === 'development') { config.url = '/char' + config.url }

    // }
    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation

    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');

    // }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    let res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return 'Error';
    } else {
      // Message({
      //   message: res.msg,
      //   duration: 3 * 1000
      // })
      return res
    }
  },
  error => {
    // console.log(error) // for debug
    // Message({
    //   message: error.msg,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
