// components/poster/poster.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posters: {
      type: Array,
      value: [
        'rulePoster_0.png',
        'rulePoster_1.png',
        'rulePoster_2.png',
      ],
    },
    url: {
      type: String,
      value: 'http://image.lemonbox.net/img/poster/'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 
    change(e) {
      this.setData({
        current: e.detail.current,
      })
    },
    // 
    cancel(e) {
      this.triggerEvent('show', { value: false })
    },
  }
})
