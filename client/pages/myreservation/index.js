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
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
  //预约删除
  deleteItemFn(e) {
    const { id, state} = e.currentTarget.dataset;
    //只有状态不是1 的才能继续删除
    if (state == 1) return false;
    const $this = this;
    singleRequest({
      url: config.API.bespeak.cancel,
      postData: {
        bespeakId: id
      },
      method: 'get',
      success: (res) => {
        console.log('res: ', res)
        showModel({
          title: "成功",
          content: '预约单删除成功~'
        }, () => {
          this.getBespeakFn()
        });
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