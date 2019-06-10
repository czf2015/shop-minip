// 
import {baseURL, path} from '../mocks/API.js'
// 
import {store} from '../store/index.js'
// 
import { getStorageSync } from './Storage.js'


export function wxerrorlog(error = {}, position = '') {
  const {
    openid,
    code,
    version
  } = store.state
  const {
    name,
    value
  } = getStorageSync('cookies')
  wx.request({
    url: `${baseURL}/${path.error}?openid=${openid}`,
    header: {
      cookie: `${name}=${value}`
    },
    method: 'POST',
    data: {
      version,
      stack: error.stack || 'except',
      message: error.message || error,
      position,
      code,
    },
  })
}

export const error = {
  SyntaxError: {
    message: '',
    stack: '',
    dispose: ''
  },
  ReferenceError: {
    message: '',
    stack: '',
    dispose: ''
  },
  TypeError: {
    message: '',
    stack: '',
    dispose: ''
  },
  RangeError: {
    message: '',
    stack: '',
    dispose: ''
  },
  URIError: {
    message: '',
    stack: '',
    dispose: ''
  },
  EvalError: {
    message: '',
    stack: '',
    dispose: ''
  },
}