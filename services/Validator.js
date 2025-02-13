// 
import {interval} from "../mock/TIME.js"


export const wish = {
  receiver: {
    msg: '收礼人姓名过长，请删除',
    max_length: 12,
    value: '',
    valid: true
  },
  content: {
    msg: '祝福语内容过长，请删除',
    max_length: 100,
    value: '',
    valid: true
  },
  sender: {
    msg: '送礼人姓名过长，请删除',
    max_length: 12,
    value: '',
    valid: true
  }
}


export function tip(validator = {}) {
  const msgs = []
  for (const key in validator) {
    const {valid, msg} = validator[key]
    if (!valid) {
      msgs.push(msg)
    }
  }
  if (msgs.length > 0) {
    wx.showToast({
      title: `${msgs.join('\n')}`,
      icon: 'none',
      mask: true,
      duration: interval,
    })
    return true
  }
  return false
}