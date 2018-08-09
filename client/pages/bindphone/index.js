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
    validateCode: ''
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
      singleRequest({
        url: config.API.user.verification + '/' + this.data.phoneInputValue,
        method: 'GET',
        success: (res) => {
          showSuccess('验证码发送成功');
          this.setData({
            sendDone: true
          })
        }
      })
    }
  },
  submitPhoneBind() {
    if (this.data.sendDone) {
      console.log(this.data.validateCode);
      singleRequest({
        url: config.API.user.bindPhone,
        postData: {
          phone: this.data.phoneInputValue,
          verificationCode: this.data.validateCode,
          openId: app.userInfo.openId
        },
        success: (res) => {
          showSuccess('手机绑定成功');
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/order/index'
            })
          }, 1500);
        }
      })
    } else {
      showModel({
        title: "错误",
        content: '请先获取验证码~'
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})