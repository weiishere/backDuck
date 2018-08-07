//app.js
//var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config');
var {
  singleRequest
} = require('./utils/util.js')

App({
  onLaunch: function() {
    let self = this;
    //qcloud.setLoginUrl(config.service.loginUrl)
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          console.log(config.API.user.login);
          singleRequest({
            url: config.API.user.login,
            postData: {
              code: res.code
            },
            success: (data) => {
              //console.log(data);
              self.userInfo = {
                code: res.code,
                openId: data.data.openId,
                cookie:data.data.cookie,
                token:data.data.token
              }
            },
            error: (data) => {

            }
          });


        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function(e) {
        //console.log(e);
      },
      complete: (res) => {
        //console.log(res);
      }
    });
  },
  userInfo: {}
})