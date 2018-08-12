// pages/home/home.js.js
import {
  showModel,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  data: {
    vipName: '',
    sideBarShow: false,
    msgCount: 0
  },
  onLoad: function (options) {
    const $this = this;
    setTimeout(() => {
      console.log('onReady: ', app.userInfo)
      $this.setData({
        avatarUrl: app.userInfo.user.avatarUrl,
        nickName: app.userInfo.user.nickName,
        vipName: app.userInfo.user.vipName
      })
      this.getMsgCountFn();
    }, 2000)
  },
  sideBarTrggle: function(e) {
    const siderState = e.currentTarget.dataset.siderState === 'true' ? true : false;
    this.setData({
      sideBarShow: siderState
    })
  },
  gotoPage: function(e) {
    const page = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: page
    });
  },
  callMobildServiceFn () {
    wx.makePhoneCall({
      phoneNumber: '15982316112'
    })
  },
  rechargeBtnFn(){
    wx.navigateTo({
      url: '/pages/recharge/index',
    })
  },
  
  getMsgCountFn(e){
    const $this = this;
    singleRequest({
      url: config.API.message.getMsgCount,
      postData: {
      },
      method: 'GET',
      success: (res) => {
        $this.setData({
          msgCount: res.data
        })
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
})