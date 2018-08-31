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
    nickName: false
  },
  onLoad: function (options) {
    const $this = this;
    wx.setNavigationBarTitle({
      title: '黑鸭子'
    })
  },
  onShow(){
    // this.setdefaultdataFn()
    // app.userInfo.token && app.getUserInfoFn((user) => {
    //   console.log('user: ', user)
    //   this.setData({
    //     avatarUrl: (user && user.avatarUrl) ? user.avatarUrl : '',
    //     nickName: (user && user.nickName) ? user.nickName : '',
    //     vipName: (user && user.vipName) ? user.vipName : ''
    //   })
    // })
    app.userLoginFn((user) => {
      console.log('user: ', user)
      this.setData({
        avatarUrl: (user && user.avatarUrl) ? user.avatarUrl : '',
        nickName: (user && user.nickName) ? user.nickName : '',
        vipName: (user && user.vipName) ? user.vipName : ''
      })
    })
  },
  setdefaultdataFn(){
    const {user} = app.userInfo
    // console.log(user)
    if (user) {
      this.setData({
        avatarUrl: (user && user.avatarUrl) ? user.avatarUrl : '',
        nickName: (user && user.nickName) ? user.nickName : '',
        vipName: (user && user.vipName) ? user.vipName : ''
      }, () => {
        // app.getUserInfoFn()
      })
    } else {
      app.userInfo.token && app.getUserInfoFn()
    }
  },
  sideBarTrggle: function(e) {
    const siderState = e.currentTarget.dataset.siderState === 'true' ? true : false;
    this.setData({
      sideBarShow: siderState
    }, () => {
      if (siderState) {
        this.getMsgCountFn();
      }
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
    // const { userInfo } = e.detail
    // // console.log('getUserInfoFn userInfo: ', app.userInfo)
    // if (!userInfo.user && e.detail.errMsg == "getUserInfo:ok") {
    //   app.userInfo.user = Object.assign(userInfo)
    //   this.setData({
    //     nickName: userInfo.nickName
    //   })
    // }
    // this.setdefaultdataFn()
  }
})