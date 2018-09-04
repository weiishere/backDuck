// pages/activity/index.js
import {
  showModel,
  showSuccess,
  singleRequest,
  formatDateTime
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()
Page({
  data: {
    imgSrc: ''
  },
  onLoad: function (options) {
  
  },
  onShow() {
    this.getActivityFn()
  },
  //获取账户余额
  getActivityFn() {
    const $this = this;
    singleRequest({
      url: config.API.activity.get,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        console.log(data)
        $this.setData({
          imgSrc: data
        })
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
  onShareAppMessage: function () {
  
  }
})