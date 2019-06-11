// components/user/user.js
// store
import { store, dispatch } from '../../store/index.js'
// utils
import { authorize } from '../../utils/Admin.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    promocode: {
      type: String,
      value: ''
    },
    promocodeUsage: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    canIUse: false,
    hasWxUserInfo: false,
    wxUserInfo: {},
  },

  attached() {
    this.init()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      const canIUse = wx.canIUse('button.open-type.getUserInfo')
      const { hasWxUserInfo, wxUserInfo } = store.state

      this.setData({
        canIUse,
        wxUserInfo,
        hasWxUserInfo,
      })
    },
    // 
    getWxUserInfo(e) {
      authorize(e, 'account').then(res => {
        this.init()
      })
    },
  },
})
