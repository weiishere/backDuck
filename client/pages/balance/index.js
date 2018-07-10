// pages/recharge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '余额充值'
    })
  },
  //滚动加载更多 分页之类的
  lower: function (e) {
    console.log(e)
  },
})