// pages/investigate/investigate.js
// mocks
import {
  questions
} from '../../mocks/INVESTIGATE.js'
import {
  baseURL,
  path
} from '../../mocks/API.js'
import {
  interval
} from '../../mocks/TIME.js'
// store
import {
  store
} from '../../store/index.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: []
  },

  // 数据转换
  adapt(questions) {
    return questions.map(question => {
      if (question.type === 'textarea') {
        question = { ...question, value: '' }
      } else {
        const options = question.options.map(option => ({
          name: option,
          value: option === question.other ? '' : option,
          checked: false
        }))
        question = { ...question, ...{ options } }
      }
      // debugger
      return question
    })
  },

  // 点击单选
  radioChange(e) {
    const {
      questions,
    } = this.data
    const question = questions[e.target.id]
    question.options
      .forEach(option => {
        option.checked = e.detail.value === option.value
      })

    this.setData({
      questions
    })
  },

  // 点击多选
  checkboxChange(e) {
    const {
      questions,
    } = this.data
    const question = questions[e.target.id]

    if (question.range && question.range.max && e.detail.value.length > question.range.max) {
      wx.showToast({
        title: `至多选${question.range.max}个`,
        icon: 'none'
      })
    } else {
      question.options
        .forEach(option => {
          option.checked = e.detail.value.includes(option.value)
        })
    }

    this.setData({
      questions
    })
  },

  // 输入其他
  inputChange(e) {
    const {
      questions
    } = this.data
    const question = questions[e.target.id]

    if (question.type === 'textarea') {
      question.value = e.detail.value
    } else {
      question.options
        .find(option => option.name === question.other)
        .value = e.detail.value
    }

    this.setData({
      questions
    })
  },

  // 提交表单
  formSubmit(e) {
    const { questions } = this.data
    const { openid } = store.state
    const answer = { ...e.detail.value, openid }

    for (const question of questions) {
      if (question.required) {
        if (question.type === 'radio') {
          const option = question.options.find(option => option.checked)
          if (option) {
            if (!option.value) {
              wx.showToast({
                title: '请填写其他选项',
                icon: 'none'
              })
              return
            }
          } else {
            wx.showToast({
              title: '有单选题忘选了哦',
              icon: 'none'
            })
            return
          }
        } else if (question.type === 'checkbox') {
          const options = question.options.filter(option => option.checked)
          if (options.length) {
            if (options.length === 1 && !options[0].value) {
              wx.showToast({
                title: '请填写其他选项',
                icon: 'none'
              })
              return
            } else {
              if (question.range) {
                if (question.range.min && options.length < question.range.min) {
                  wx.showToast({
                    title: '有多选题少选了哦',
                    icon: 'none'
                  })
                  return
                }
              }
            }
          } else {
            wx.showToast({
              title: '有多选题忘选了哦',
              icon: 'none'
            })
            return
          }
        } else {
          if (!question.value) {
            wx.showToast({
              title: '请填写填空题目',
              icon: 'none'
            })
            return
          }
        }
      }
    }

    wx.request({
      url: baseURL + '/v1/quick_survey',
      data: answer,
      method: 'POST',
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 'success') {
            wx.showToast({
              title: '提交成功,您可找客服领取60元优惠券',
              icon: 'none',
            });
            setTimeout(() => {
              wx.switchTab({
                url: '../account/account'
              })
            }, interval);
          } else {
            wx.showToast({
              title: '提交失败，请重试' + res.data.error,
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '提交失败，请重试（I' + res.statusCode + ')',
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none',
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ questions: this.adapt(questions) })
  }
})