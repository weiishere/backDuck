//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config');
let userInfo = {};

App({
  onLaunch: function() {
    let self = this;
    //qcloud.setLoginUrl(config.service.loginUrl)
    
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://118.25.217.48:9881/user/login/oauth',
            data: {
              code: res.code
            },
            header:{
              'content-type':'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
              console.log(res);
            },
            fail: function() {
              showModel('请求错误');
            },
            complete: function() {
              wx.hideLoading();
            }
          });


          self.userInfo = {
            code: res.code
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail:function(e){
        console.log(e);
      }
    });
  },
  userInfo: userInfo
})