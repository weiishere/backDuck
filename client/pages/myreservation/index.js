// pages/myreservation/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的预约',
    })
    this.getBespeakFn()
  },
  getBespeakFn(){
    singleRequest({
      url: config.API.bespeak.list,
      postData: {
        pageSize: this.data.pageSize || 10,
        currentPage: this.data.currentPage || 1
      },
      method: 'get',
      success: (res) => {
        console.log(res)
        
      }, 
      error(res){
        console.log('错误')
      }
    })
  }
})