// components/pack/pack.js
// mocks
import { interval } from '../../mocks/TIME.js'
import {
  base,
  path
} from '../../mocks/API.js'
import {
  Specifies,
} from '../../mocks/BUSINESS.js'
// utils
import { request } from '../../utils/Http.js'
import { wxerrorlog } from '../../utils/Error.js'



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pack: {
      type: Object,
      value: {

      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // specifies,
    Specifies,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview() {
      const { order_item_id } = this.data.pack
      wx.navigateTo({
        url: `/pages/recipe/recipe?order_item_id=${order_item_id}`
      })
    },

    radioChange(e) {
      const that = this

      request({
        url: `${base}/v1/update_shopping_cart`,
        method: 'POST',
        data: {
          "goodsInfo": {
            orders: [{
              "order_item_id": that.data.order.order_item_id,
              "specify": parseFloat(e.detail.value)
            }]
          }
        },
        errorMsg: '返回错误'
      })
        .then(res => {
          const carts = res.data.result.data
          const packs = carts[0].shopping_cart.orders

          that.triggerEvent('refresh', {
            packs: Object.keys(packs).map(key => packs[key]) // Object.values(packs)
          })
        }).catch(err => {
          wxerrorlog(err, 'components: pack:: radioChange->规格选取失败')
        })
    },

    remove() {
      const that = this

      wx.showModal({
        title: '提示',
        content: '是否删除该商品？',
        success(res) {
          if (res.confirm) {
            request({
              url: `${base}/v1/delete_shopping_cart`,
              method: 'POST',
              data: {
                "goodsInfo": {
                  "orderItemIds": [that.data.pack.order_item_id]
                }
              },
              errorMsg: '删除失败'
            })
              .then(res => {
                wx.showToast({
                  title: '删除成功', //res.data.error,
                  icon: 'none',
                  mask: true,
                  duration: interval * 0.25
                })
                const carts = res.data.result.data
                if (carts.length > 0) {
                  const packs = carts[0].shopping_cart.orders

                  that.triggerEvent('refresh', {
                    packs: Object.keys(packs).map(key => packs[key])
                  }) // Object.values(packs)
                } else {
                  that.triggerEvent('refresh', {
                    packs: []
                  })
                }
              }).catch(err => {
                wxerrorlog(err, 'components: pack:: remove->删除商品失败')
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
})