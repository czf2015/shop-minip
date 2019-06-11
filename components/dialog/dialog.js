// components/dialog/dialog.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialog: {
      type: Object,
      value: {
        title: '',
        content: [],
        image: '/image/sorry.png'
      }
    },
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
    confirm(e) {
      this.triggerEvent('dialog', {value: true})
    },
    cancel(e) {
      this.triggerEvent('dialog', { value: false })
    },
  }
})
