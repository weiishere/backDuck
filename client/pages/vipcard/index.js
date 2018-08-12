// pages/vipcard/index.js
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
    isLogined: false,
    viptype: 'gold',
    user: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '会员卡',
    })
    if (!this.data.user) {
      this.setData({
        user: app.userInfo.user
      })
    }
  },
  userBtnEventFn(e){
    const { viptype, user} = this.data;
    if (user) {
      wx.navigateTo({
        url: '/pages/vipupgraded/index',
      })
    } else {
      //未登陆用户不知道逻辑暂时跳转到绑定页面
      wx.navigateTo({
        url: '/pages/bindphone/index',
      })
    }
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  //获取会员信息
  getRechargeListFn() {
    const $this = this;
    singleRequest({
      url: config.API.recharge.activity,
      postData: {
      },
      method: 'get',
      success: (res) => {
        let data = res.data;
        console.log(data)
        if (data) {
          $this.setData({
            activityList: data
          })
        } else {
          showModel({
            title: "错误",
            content: "收货地址为空~"
          });
        }

      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  }
})