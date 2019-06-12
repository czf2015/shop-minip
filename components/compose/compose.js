// components/compose/compose.js 
// mocks
import { interval } from '../../mocks/TIME.js'
// store
import {
  dispatch,
  store
} from '../../store/index.js'
// utils
import {
  specifies,
  getPackPrice,
  getCategoriesPrice,
} from '../../utils/calculate.js'
import { request } from '../../utils/Http.js'
import { wxerrorlog } from '../../utils/Error.js'
import { getTransportFee } from '../../utils/purchase.js'


Component({
  /** 
   * 组件的属性列表 
   */
  properties: {
    categories: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        let typeNum = 0
        let number = 0
        newVal.forEach(category => category.items.forEach(item => {
          if (item.selected && item.checked) {
            typeNum++
            number += item.dose.dose
          }
        }))
        const sum = getCategoriesPrice(newVal)
        const pay = getPackPrice(sum, this.data.specify)
        const monthPrice = {}
        this.data.radios.forEach(item => {
          monthPrice[item.value] = (parseFloat(getPackPrice(sum, item.value)) / item.value).toFixed(0)
        })

        this.setData({
          typeNum,
          number,
          excess: typeNum > 8 || number > 9,
          sum,
          pay,
          monthPrice
        })
      }
    },

    specify: {
      type: Number,
      value: 3,
      observer(newVal, oldVal, changedPath) {
        const pay = getPackPrice(this.data.sum, newVal)
        const {
          radios
        } = this.data
        radios.forEach(item => item.checked = item.value === newVal)

        this.setData({
          pay,
          radios,
        })
      }
    },

    num: {
      type: Number,
      value: 1
    },

    name: {
      type: String,
      value: ''
    },

    display: {
      type: String,
      value: 'hidden'
    },

    // onOff: {
    //   type: String,
    //   value: 'off'
    // },

    wish: {
      type: Object,
      value: {
        receiver: '',
        content: '',
        sender: ''
      }
    },

    no_herbs_flag: {
      type: Boolean,
      value: false
    },

    sourceGiftReferCode: {
      type: String,
      value: ''
    }
  },

  /** 
   * 组件的初始数据 
   */
  data: {
    specifies,
    typeNum: 0,
    number: 0,
    sum: 0,
    pay: 0,
    excess: false,
    monthPrice: {},
    transportFee: {},
    giftReferCode: '',
    radios: [{
      name: '3 月装',
      value: 3,
      checked: true
    }, {
      name: '2 月装',
      value: 2,
      checked: false
    }, {
      name: '1 月装',
      value: 1,
      checked: false
    },],
    onOff: 'off'
  },

  // 挂载时 
  attached() {
    this.getTransportFee()
    const {
      giftReferCode
    } = store.state
    this.setData({
      giftReferCode,
    })
  },

  /** 
   * 组件的方法列表 
   */
  methods: {
    getTransportFee() {
      getTransportFee().then(transportFee => {
        this.setData({
          transportFee,
        })
      })
    },

    // 删除补剂
    remove(e) {
      const {
        typeNum
      } = this.data
      if (typeNum > 4 || typeNum > store.state.typeNum) {
        this.triggerEvent('remove', e.detail)
      } else {
        wx.showToast({
          title: `补剂种类不能少于${typeNum}种`,
          icon: 'none',
          duration: interval * 0.5,
        })
      }
    },

    // 添加补剂弹窗控制 
    popup() {
      this.triggerEvent('store')

      wx.navigateTo({
        url: '/pages/recipe/recipe?display=show'
      })
    },

    // 添加或取消补剂 
    append(e) {
      this.triggerEvent('append', e.detail)
      this.setData({
        typeNum: this.data.typeNum + (e.detail.selected ? 1 : -1)
      })
    },

    // 完成添加补剂 
    done(e) {
      wx.navigateBack({
        delta: 1
      }, () => {
        dispatch('set', { hadLook: false })
      })
    },

    // 完成药品选取 
    finish() {
      this.setData({
        onOff: 'on'
      })
      // this.triggerEvent('store')

      // wx.navigateTo({
      //   url: '/pages/recipe/recipe?onOff=on'
      // })
    },

    cancel() {
      this.setData({
        onOff: 'off'
      })
    },

    // 
    checkboxChange(e) {
      const {
        categories,
        typeNum
      } = this.data
      const category = categories.find(category => category.title === e.detail.title)
      if (category.items.filter(item => item.checked).length > e.detail.value.length) {
        if (!(typeNum > 4 || typeNum > store.state.typeNum)) {
          this.setData({
            categories
          })
          wx.showToast({
            title: `补剂种类不能少于${typeNum}种`,
            icon: 'none',
            duration: interval * 0.5,
          })
          return
        }
      }
      // } else {
      category.items.forEach(item => {
        item.checked = e.detail.value.includes(`${item.id}`)
      })
      this.triggerEvent('checkboxChange', {
        value: categories
      })
      // }
    },

    // 规格选取 
    choose(e) {
      this.triggerEvent('choose', {
        specify: parseFloat(e.detail.value)
      })
    },

    fill(e) {
      const id = e.target.id
      const value = e.detail.value
      const length = value.replace(/[^\u0000-\u00ff]/g, "aa").length
      switch (true) {
        case (id === 'receiver' || id === 'sender') && length > 12:
          wx.showToast({
            title: '姓名过长',
            icon: 'none',
            mask: true,
            duration: interval,
          })
          this.triggerEvent('validate', {
            id,
            valid: false
          })
          return
        case id === 'content' && length > 100:
          wx.showToast({
            title: '祝福语内容过长',
            icon: 'none',
            mask: true,
            duration: interval,
          })
          this.triggerEvent('validate', {
            id,
            valid: false
          })
          return
        default:
          this.triggerEvent('validate', {
            id,
            valid: true
          })
          this.triggerEvent('fill', {
            id,
            value,
          })
      }
    }
  }
})