// pages/vipcard/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogined: false,
    viptype: 'gold'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '会员卡',
    })
  },
  userBtnEventFn(e){
    const { viptype, isLogined} = this.data;
    if (isLogined) {
      wx.navigateTo({
        url: '/pages/vipupgraded/index',
      })
    } else {
      //未登陆用户不知道逻辑暂时跳转到绑定页面
      wx.navigateTo({
        url: '/pages/bindphone/index',
      })
    }
  }
})