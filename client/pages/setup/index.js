// pages/address/add/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()
Page({
  data: {
    havePayPWD: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设置',
    })
    this.havePayPWDFn()
  },
  clickEventFn (e) {
    const {type} = e.currentTarget.dataset;
    // console.log(type)
  },

  //获取用户是否有支付密码
  havePayPWDFn() {
    const $this = this;
    singleRequest({
      url: config.API.setting.isHavePayPWD,
      postData: {
      },
      method: 'GET',
      success: (res) => {
        let data = res.data;
        $this.setData({
          havePayPWD: data
        })

      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  }
})