// 
import {
    baseURL,
    path,
} from '../mocks/API.js'
// 
import {
    dispatch,
    store
} from '../store/index.js'
// 
const url = `${baseURL}/${path.formid}`


export function submitFormid(e) {
    wx.request({
        url,
        method: 'POST',
        data: {
            openid: store.state.openid,
            formid: e.detail.formId
        }
    })
}