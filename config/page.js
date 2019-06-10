// v1/page_config // 网络不稳定影响，只能用于非重要性信息

// 页面配置
const config = {
    // 首页
    index: {
      poster: {
        // 母亲节
        motherDay: {
          url: [
            'rulePoster_0.png',
            'rulePoster_1.png',
            'rulePoster_2.png',
          ], // [String], // 海报URL
          purpose: '母亲节活动', // String, // 用途
          condition: '送给女性用户', // String, // 条件
          recurrent: true, // Boolean, // 可复现性
          given: 'any', // String, // never, ever, any 用户类型
          time: {
            start: '2019-05-08', // Date,
            end: '2019-05-12', // Date
          }
        },
        // 上线
        onLine: {
          url: [
            'rulePoster_0.png',
            'rulePoster_1.png',
            'rulePoster_2.png',
          ], // [String], // 海报URL
          purpose: '程序或商品上线提示', // String, // 用途
          condition: '新功能或新产品', // String, // 条件
          recurrent: false, // Boolean, // 可复现性
          given: 'any', // String, // never, ever, any 用户类型
          time: {
            start: '2019-01-01', // Date,
            end: '2019-01-01', // Date
          }
        },
      },
    },
    // 订单管理页
    orderList: {
      // 通知
      notify: {
        // 退款
        refund: {
          msg: [{
            title: '退款申请中', // String, // 标题
            content: ['您的退款申请已提交，工作人员将在 1-3 个工作日内处理，请耐心等待。'], // [String], // 内容
            image: ''
          }],
          purpose: '申请退款时提示', // String,
          condition: '申请退款时，订单状态为"申请退款"', // String,
          recurrent: true, // Boolean,
          given: 'any', // String,
          time: {
            start: '2019-05-01', // Date,
            end: '2019-06-01', // Date
          }
        },
        // 物流
        ship: {
          msg: [{
            title: '待发货', // String, // 标题
            content: ['因近期订单量大，您的订单发货可能会有所延迟，为了表达歉意，在您确认收货后即可获得 20-50 元现金补偿，详情可咨询客服。'] // [String], // 内容
          }],
          purpose: '物流延迟提示', // String,
          condition: '物流延迟', // String,
          recurrent: true, // Boolean,
          given: 'any', // String,
          time: {
            start: '2019-05-01', // Date,
            end: '2019-05-10', // Date
          }
        },
      },
    },
    // 订单详情
    orderInfo: {
      // 通知
      notify: {
        // 退款
        refund: {
          msg: [{
            title: '退款申请中', // String, // 标题
            content: ['您的退款申请已提交，工作人员将在 1-3 个工作日内处理，请耐心等待。'], // [String], // 内容
            image: ''
          }],
          purpose: '申请退款时提示', // String,
          condition: '申请退款时，订单状态为"申请退款"', // String,
          recurrent: true, // Boolean,
          given: 'any', // String,
          time: {
            start: '2019-05-01', // Date,
            end: '2019-06-01', // Date
          }
        },
        // 物流
        ship: {
          msg: [{
            title: '待发货', // String, // 标题
            content: ['因近期订单量大，您的订单发货可能会有所延迟，为了表达歉意，在您确认收货后即可获得 20-50 元现金补偿，详情可咨询客服。'] // [String], // 内容
          }],
          purpose: '物流延迟提示', // String,
          condition: '物流延迟', // String,
          recurrent: true, // Boolean,
          given: 'any', // String,
          time: {
            start: '2019-05-01', // Date,
            end: '2019-05-10', // Date
          }
        },
      },
      // 申请退款页
      refund: {
        notify: {
          // 订单状态
          apply: {
            msg: [{
              title: '抱歉让您久等了', // String, // 标题
              content: ['每一盒 LemonBox 都在营养师监督下定制生产，相信它值得您的等待。'], // [String], // 内容,
              image: '/image/sorry.png'
            }],
            purpose: '退款原因提示', //String,
            condition: '用户选择退款原因', // String,
            recurrent: true, // Boolean,
            given: 'any', // String,
            time: {
              start: '2019-05-21', // Date,
              end: '2020-01-01', // Date
            }
          },
        }
      }
    },
    // 我的页面
    account: {
      // 展示图片类信息
      banner: {
        // 领取赏金
        taken: {
          url: ['dragonBanner.png'], // [String], // 海报URL
          purpose: '下过单后的用户使用自己的邀请码，邀请其他用户兑换优惠券成功下单后，即可获取现金奖赏（龙计划）', // String, // 用途
          condition: '被邀请用户满300减100，邀请者同时获得50元返利。', // String, // 条件
          recurrent: true, // Boolean, // 可复现性
          given: 'any', // String, // never, ever, any 用户类型
          time: {
            start: '2019-01-01', // Date,
            end: '2020-01-01', // Date
          }
        },
      }
    },
    // 龙计划
    dragon: {
      banner: {
        // 领取赏金
        taken: {
          url: ['dragonBg.jpg'], // [String], // 海报URL
          purpose: '龙计划', // String, // 用途
          condition: '每邀请1位新人下单，立得50元现金', // String, // 条件
          recurrent: true, // Boolean, // 可复现性
          given: 'any', // String, // never, ever, any 用户类型
          time: {
            start: '2019-01-01', // Date,
            end: '2020-01-01', // Date
          }
        },
        // 攻略
        guide: {
          url: ['dragonRule.png'], // [String], // 海报URL
          purpose: '邀请返利规则说明', // String, // 用途
          condition: '满300元可用', // String, // 条件
          recurrent: true, // Boolean, // 可复现性
          given: 'any', // String, // never, ever, any 用户类型
          time: {
            start: '2019-01-01', // Date,
            end: '2020-01-01', // Date
          }
        },
      },
      // 展示文字类信息
      board: {
        // 注意
        notice: {
          // 信息
          msg: [{
            title: '注意事项', // String, // 标题
            content: ['1、加好友首单发送取消、退款时，邀请奖励将同步失效，如邀请者订单发生取消、退款，将无法获得奖励。',
              '2、同一支付账号、手机号、身份证号、手机终端，符合以上任意条件均视为同一用户，即为无效订单，若使用非正常手段邀请好友，Lemonbox 有权不发放奖励。',
              '3、本活动处于试运行阶段，最终解释权归 Lemonbox 所有。'
            ], // [String], // 内容
          }],
          // 
          purpose: '“龙计划”详细解释说明', // String,
          condition: '不针对同一用户', // String,
          recurrent: true, // Boolean,
          given: 'any', // String,
          time: {
            start: '2019-01-01', // Date,
            end: '2020-01-01', // Date
          }
        }
      }
    }
  }