//app.js
//var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config');
var {
  singleRequest
} = require('./utils/util.js')

App({
  onLaunch: function() {
    wx.setNavigationBarTitle({
      title: '黑鸭子',
    })
    this.userLoginFn()
  },
  userLoginFn(fn){
    let self = this;
    //qcloud.setLoginUrl(config.service.loginUrl)
    wx.login({
      success: function (res) {
        // console.log('wx.login: ', res)
        if (res.code) {
          //发起网络请求
          // console.log(config.API.user.login);
          singleRequest({
            url: config.API.user.login,
            postData: {
              code: res.code
            },
            success: (data) => {
              // console.log('data: ', data)  
              self.userInfo = {
                code: res.code,
                openId: data.data.openId,
                cookie: data.data.cookie,
                token: data.data.token
              }
              if (data.data.token) {
                // 查看是否授权
                wx.getSetting({
                  success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                      wx.getUserInfo({
                        success: function (res) {
                          self.wechatUserInfo = res.userInfo
                          self.getUserInfoFn(fn)
                          // self.userInfo = Object.assign(self.userInfo, { user: res.userInfo})
                          // console.log(self.userInfo)
                        }
                      })
                    }
                  }
                })
              } else {
                wx.redirectTo({
                  url: '/pages/bindphone/index',
                })
              }
              
            },
            error: (data) => {

            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function (e) {
        //console.log(e);
      },
      complete: (res) => {
        //console.log(res);
      }
    });
  },
  userInfo: {},
  addUserInfoFn(data) {
    let self = this;
    data.nickname = data.nickName;
    delete data.nickName
    singleRequest({
      url: config.API.user.addInfo,
      postData: {
        jsonData: JSON.stringify(data)  
      },
      success: (res) => {
        // console.log('success: ', res)
      },
      error: (res) => {
        // console.log('error: ', res)
      }
    });
  },
  getUserInfoFn(fn) {
    let self = this;
    singleRequest({
      url: config.API.user.getInfo,
      method: 'GET',
      postData: {
      },
      success: (res) => {
        if (!res.data.nickname) {
          self.addUserInfoFn(self.wechatUserInfo)
        }
        self.userInfo = Object.assign(self.userInfo, { user: { vipName: res.data.vipName, vipId: res.data.vipId, ...self.wechatUserInfo }})
        // console.log('getUserInfoFn - success: ', res)
        fn && fn()
      },
      error: (res) => {
        // console.log('getUserInfoFn - error: ', res)
      }
    });
  }
})