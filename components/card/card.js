// components/card/card.js
// store
import { store, dispatch } from '../../store/index.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entity: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    unit: {
      day: '天',
      week: '周',
      month: '月',
    },
    selected: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select() {
      this.setData({
        selected: !this.data.selected
      })
      this.triggerEvent('select', { id: this.data.entity.id, selected: this.data.selected })
    },

    // 药品介绍
    look(e) {
      dispatch('switch', {
        key: 'hadLook',
        value: true
      })
      wx.navigateTo({
        url: '/pages/wikiDetail2/wikiDetail2?id=' + e.target.id,
      })
    },
  },
})
