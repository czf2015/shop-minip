// components/category/category.js


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

        const Checked = {}
        newVal.items.forEach(item => {
          Checked[item.id] = item.checked
        })

        if (newVal.items.some(item => item.selected)) {
          that.setData({
            isSelectNone: false,
            Checked,
          })
        } else {
          that.setData({
            isSelectNone: true,
            Checked,
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSelectNone: false,
    Checked: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    remove(e) {
      this.triggerEvent('remove', {
        title: this.data.category.title,
        ...e.detail
      })
    },

    // 多选触发
    checkboxChange(e) {
      this.triggerEvent('checkboxChange', {
        title: this.data.category.title,
        value: e.detail.value
      })
    },
  }
})