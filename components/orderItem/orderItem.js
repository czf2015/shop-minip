// components/orderItem/orderItem.js
// mocks
import { interval } from '../../mocks/TIME.js'
import { base } from '../../mocks/API.js'
import {
  OrderStatus,
  Specifies,
} from '../../mocks/BUSINESS.js' //获取常量定义类
// utils
import { request } from '../../utils/Http.js'
import { wxerrorlog } from '../../utils/Error.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    OrderStatus,
    Specifies,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    check() {
      const order = this.data.order
      wx.navigateTo({
        url: `/pages/orderInfo/orderInfo?orderId=${order.id}`
      })
    },

    abolish(e) {
      const that = this
      wx.showModal({
        title: '提示',
        content: '是否删除该订单？',
        success(res) {
          if (res.confirm) {
            request({
              url: `${base}/v1/${e.target.dataset.path}`,
              method: 'POST',
              data: {
                "orderInfo": { //key名称，必填
                  "orderId": that.data.order.id //待支付订单ID，必填
                }
              },
              errorMsg: '返回错误'
            }).then(res => {
              wx.hideLoading()
              wx.showToast({
                title: '删除成功', //res.data.error,
                icon: 'none',
                mask: true,
                duration: interval * 0.25
              })
              that.triggerEvent('refresh', {
                orderId: that.data.order.id
              })
            }).catch(err => {
              wxerrorlog(err, 'components: orderItem:: abolish->删除订单失败')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    sureShipped() {
      const that = this
      wx.showModal({
        title: '提示',
        content: '是否确认收货？',
        success(res) {
          if (res.confirm) {
            request({
              url: `${base}/v1/update_user_orders_status?${new Date().getTime()}`,
              method: 'POST',
              data: {
                "orderInfo": { //key名称，必填
                  "orderId": that.data.order.id, //待支付订单ID，必填
                  "orderStatus": "order_finished"
                },
                errorMsg: '确认提交失败'
              }
            }).then(res => {
              that.triggerEvent('refresh', {
                orderId: that.data.order.id
              })
            }).catch(err => {
              wxerrorlog(err, 'components: orderItem:: sureShipped->确认收货失败')
            })
          }
        }
      })
    },

    checkShipped() {
      const order = this.data.order
      wx.navigateTo({
        url: `/pages/logistics/logistics?orderId=${order.id}&orderNum=${order.msg.full_order_info.orders.length}`,
      })
    },

    refundRequest() {
      const {
        id,
        msg
      } = this.data.order

      const { orders } = msg.full_order_info
      if (orders.length === 1) {
        wx.navigateTo({
          url: `/pages/refund/refund?orderId=${id}&suggest_id=${orders[0].suggest_id}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/refund/refund?orderId=${id}`
        })
      }
    },

    cancelRefundRequest() {
      const that = this
      request({
        url: `${base}/v1/user_refund?${new Date().getTime()}`,
        method: 'POST',
        data: {
          "refund_info": { //key名称，必填
            "orderId": that.data.order.id, //待支付订单ID，必填
            "orderStatus": "order_paid"
          }
        },
        errorMsg: '取消申请失败'
      }).then(res => {
        that.triggerEvent('refresh', {
          orderId: that.data.order.id
        })
      }).catch(err => {
        wxerrorlog(err, 'components: orderItem:: cancelRefundRequest->取消退款失败')
      })
    }
  }
})