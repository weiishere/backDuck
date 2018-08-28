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
    msgCount: 0,
    nickName: ''
  },
  onLoad: function (options) {
    const $this = this;
    wx.setNavigationBarTitle({
      title: '黑鸭子'
    })
  },
  onShow(){
    setTimeout(() => {
      this.setdefaultdataFn()
    }, 1500)
  },
  setdefaultdataFn(){
    if (app.userInfo.user) {
      this.setData({
        avatarUrl: app.userInfo.user.avatarUrl,
        nickName: app.userInfo.user.nickName,
        vipName: app.userInfo.user.vipName ? app.userInfo.user.vipName : ''
      }, () => {
        // app.getUserInfoFn()
      })
      this.getMsgCountFn();
    }
  },
  sideBarTrggle: function(e) {
    console.log(e)
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
      phoneNumber: '400-002-2003'
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
      }
    })
  },
  getUserInfoFn(e) {
    // console.log('getUserInfoFn: ', e)
    // console.log('getUserInfoFn userInfo: ', app.userInfo)
    if (!app.userInfo.user && e.detail.errMsg == "getUserInfo:ok") {
      app.userInfo.user = Object.assign(e.detail.userInfo)
    }
    this.setdefaultdataFn()
  }
})