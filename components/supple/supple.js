// components/supple/supple.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        const that = this
        if (newVal.items.every(item => item.selected)) {
          that.setData({
            isSelectAll: true
          })
        } else {
          that.setData({
            isSelectAll: false
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSelectAll: true
  },


  /**
   * 组件的方法列表
   */
  methods: {
    select(e) {
      this.triggerEvent('select', {
        title: this.data.category.title,
        ...e.detail
      })
    }
  }
})
