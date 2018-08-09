// pages/myreservation/index.js
import {
  showModel,
  showSuccess,
  singleRequest,
  formatDateTime
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: ''
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
    const $this = this;
    singleRequest({
      url: config.API.bespeak.list,
      postData: {
        pageSize: this.data.pageSize || 10,
        currentPage: this.data.currentPage || 1
      },
      method: 'get',
      success: (res) => {
        console.log('res: ', res)
        let data = res.data;
        data.map((item, index)=>{
          let statusText = '';
          item.address = JSON.parse(item.address)
          if (item.state == -1) {
            statusText = '取消'
          } else if (item.state == 0) {
            statusText = '待取件'
          } else if (item.state == 1) {
            statusText = '已取件'
          } else if (item.state == 2) {
            statusText = '已下单'
          }
          item.statusText = statusText
          item.time = formatDateTime(item.takePartTime)
          return item
        })
        $this.setData({
          list: res.data
        })
      }, 
      error(res){
        console.log('错误')
      }
    })
  }
})