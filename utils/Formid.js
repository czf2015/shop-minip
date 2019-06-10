import {
    dispatch,
    store
  } from '../store/index.js'
import {
    baseURL,
    path,
  } from '../mocks/API.js'

  const url = `${baseURL}/${path.formid}`

export function obtainFormid(e) {
    wx.request({
      url,
      method: 'POST',
      data: {
        openid: store.state.openid,
        formid: e.detail.formId
      }
    })
  }