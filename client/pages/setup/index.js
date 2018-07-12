// pages/address/add/index.js
Page({
  data: {
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设置',
    })
  },
  clickEventFn (e) {
    const {type} = e.currentTarget.dataset;
    console.log(type)
  }
})