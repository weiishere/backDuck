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
  
  },
  opinionInputFn(e){
    const {value} = e.detail
    this.setData({
      opinion: value 
    })
  },
  opinionSubmitFn() {
    const { opinion } = this.data
    singleRequest({
      url: config.API.opinion,
      postData: {
        opinion
      },
      success: (res) => {
        showSuccess('提交成功');
        this.setData({
          opinion: ''
        })
      }
    })
  }
})