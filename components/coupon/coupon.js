// components/coupon/coupon.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: {
      type: Array,
      value: {}
    },
    isSwiper: {
      type: Boolean,
      value: false
    },
    canUse: {
      type: Boolean,
      value: true
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
    alter(e) {
      this.triggerEvent("alter", {value: e.currentTarget.id})
    }
  }
})
