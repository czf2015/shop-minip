// components/contact/contact.js
// store
import {store} from '../../store/index.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    wxUserInfo: {},
    unionId: '',
  },

  attached() {
    const { wxUserInfo, unionId } = store.state
    this.setData({
      wxUserInfo,
      unionId,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
