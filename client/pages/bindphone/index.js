// pages/bindphone/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneInputValue: '',
    sendDone: false,
    validateCode: '',
    approved: false,
    countNum: 60,
    btnText: '获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    wx.setNavigationBarTitle({
      title: '绑定手机',
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        self.setData({
          approved: res.authSetting['scope.userInfo'] ? true : false
        })
      }
    })
  },
  onGotUserInfo (e) {
    const { errMsg, userInfo, rawData } = e.detail
    // console.log('errMsg: ', errMsg)
    // console.log('userInfo: ', userInfo)
    // console.log('rawData: ', rawData)
    this.setData({
      approved: e.detail.rawData ? true : false
    }, () => {
      if (userInfo) {
        if (app.userInfo && app.userInfo.user) {
          app.userInfo.user = Object.assign(app.userInfo.user, {...userInfo})
        } else {
          app.userInfo = Object.assign(app.userInfo, {
            user: {
              ...userInfo
            }
          })
        }
        console.log('app.userInfo: ', app.userInfo)
        this.submitPhoneBind()
      }
    });
  },
  bindKeyInput(e) {
    this.setData({
      phoneInputValue: e.detail.value
    });
  },
  validateCodeInput(e) {
    this.setData({
      validateCode: e.detail.value
    });
  },
  verification() {
    if (!(/^1[345789]\d{9}$/.test(this.data.phoneInputValue))) {
      showModel({
        title: "错误",
        content: '您输入的手机号不合法~'
      });
      return false;
    } else {
      if (this.data.countNum == 60) {
        wx.showLoading({
          title: '',
        })
        singleRequest({
          url: config.API.user.verification + '/' + this.data.phoneInputValue,
          method: 'GET',
          success: (res) => {
            this.setData({
              sendDone: true
            }, () => {
              this.countdownFn()
            })
          },
          error(res) {
            showModel({
              title: "发送失败",
              content: `${res.msg}~`
            });
          }
        })
      }
    }
  },
  countdownFn() {
    const $this = this;
    let { countNum } = this.data
    const countId = setInterval(() => {
      if (countNum <= 0) {
        $this.setData({
          countNum: 60,
          btnText: '获取验证码'
        })
        clearInterval(countId)
      } else {
        $this.setData({
          countNum: (countNum -= 1),
          btnText: `${countNum}s`
        })
      }
    }, 1000)
  },
  submitPhoneBind() {
    if (!(/^1[345789]\d{9}$/.test(this.data.phoneInputValue))) {
      showModel({
        title: "错误",
        content: '您输入的手机号不合法~'
      });
      return false;
    }

    if (this.data.sendDone) {
      // console.log(this.data.validateCode);
      wx.showLoading({
        title: '',
      })
      singleRequest({
        url: config.API.user.bindPhone,
        postData: {
          phone: this.data.phoneInputValue,
          verificationCode: this.data.validateCode,
          openId: app.userInfo.openId
        },
        success (res) {
          showSuccess('手机绑定成功');
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/home/index'
            })
          }, 1500);
        }, 
        error(res){
          console.log(res)
        }
      })
    } else {
      showModel({
        title: "错误",
        content: '请先获取验证码~'
      });
    }
  }
})