//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  globalData: {
    "tempCode": "text",
    "userInfo": {}
  },
  onLaunch: function() {
    //qcloud.setLoginUrl(config.service.loginUrl)
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          console.log(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }
})