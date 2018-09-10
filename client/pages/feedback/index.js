// pages/feedback/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  data: {
    opinion: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意见反馈',
    })
  },
  opinionInputFn(e){
    const {value} = e.detail
    this.setData({
      opinion: value 
    })
  },
  opinionSubmitFn() {
    const { opinion } = this.data
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url: config.API.opinion,
      postData: {
        opinion
      },
      success: (res) => {
        showSuccess('感谢您提出的宝贵意见~');
        this.setData({
          opinion: ''
        })
      }
    })
  }
})