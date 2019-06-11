// components/entrance/entrance.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entrance: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    lookup(e) {
      wx.navigateTo({
        url: `/pages/orderList/orderList?title=${e.currentTarget.dataset.title}`
      })
    },
    goToMall() {
      wx.navigateToMiniProgram({
        appId: 'wxdd101b47ae239ae0',
        path: 'pages/usercenter/dashboard/index'
      })
    },
  }

})