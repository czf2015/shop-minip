// components/screen/screen.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      value: 'background: #dcdee0;'
    },
    padding: {
      type: String,
      value: 'padding: 0 40rpx 375rpx 40rpx;'
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
    noMove() {}
  }
})
