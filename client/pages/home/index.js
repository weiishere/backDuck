// pages/home/home.js.js
import {
  showModel
} from '../../utils/util.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sideBarShow: false
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  callMobildServiceFn () {
    wx.makePhoneCall({
      phoneNumber: '15982316112'
    })
  }
})