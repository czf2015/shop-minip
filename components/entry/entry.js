// components/entry/entry.js
// store
import { store, dispatch } from '../../store/index.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entry: {
      type: Object,
      value: {}
    }
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
    // 与滑动删除有关
    touch: {},
    delBtnWidth: 158//删除按钮宽度单位（rpx）
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 滑动删除显示或关闭
    angle(start, end) {
      return 360 * Math.atan((end.clientY - start.clientY) / (end.clientX - start.clientX)) / (2 * Math.PI)
    },

    touchStart(e) {
      if (e.touches.length === 1) {
        this.setData({
          touch: e.touches[0]
        })
      }
    },

    touchEnd(e) {
      const that = this

      if (e.changedTouches.length === 1) {
        const angle = that.angle(that.data.touch, e.changedTouches[0])
        let txtStyle = ''
        if (Math.abs(angle) < 30) {
          const moveX = that.data.touch.clientX - e.changedTouches[0].clientX;
          const delBtnWidth = that.data.delBtnWidth;
          //如果距离小于删除按钮的1/2，不显示删除按钮
          txtStyle = moveX > delBtnWidth / 2 ?
            `left: -${delBtnWidth}rpx; border-radius: 10rpx 0 0 10rpx` :
            `left: -${delBtnWidth}rpx; transform: translate(${delBtnWidth}rpx, 0); transition: transform 0.35s`
        }

        that.setData({
          'entry.txtStyle': txtStyle
        })
      }
    },

    touchMove(e) {
      const that = this

      if (e.touches.length === 1) {
        const angle = that.angle(that.data.touch, e.touches[0])

        if (Math.abs(angle) < 30) {
          const moveX = that.data.touch.clientX - e.touches[0].clientX
          const delBtnWidth = that.data.delBtnWidth;
          const txtStyle = moveX > 0 ?
            `left: -${moveX < delBtnWidth ? moveX : delBtnWidth}rpx; border-radius: 10rpx 0 0 10rpx` :
            ''

          that.setData({
            'entry.txtStyle': txtStyle
          })
        }
      }
    },

    // 移除该项
    remove(e) {
      this.triggerEvent('remove', {
        id: this.data.entry.id,
        selected: false
      })
    },

    // 药品介绍
    look(e) {
      dispatch('set', { hadLook: true })
      wx.navigateTo({
        url: '/pages/wikiDetail2/wikiDetail2?id=' + e.target.id,
      })
    },
  },
})