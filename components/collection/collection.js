// components/collection/collection.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    radios: {
      type: Array,
      default: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      this.triggerEvent('select', {
        ...e.target.dataset
      })
    },
    onInput(e) {
      this.triggerEvent('input', {
        value: e.detail.value
      })
    }
  },
})