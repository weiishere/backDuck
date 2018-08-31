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
    list: [],
    nocontent: false,
    pageSize: 10,
    currentPage: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的预约',
    })
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      },
    })
  },
  onShow () {
    this.getBespeakFn()
  },
  getBespeakFn (paged = false) {
    const $this = this;
    let { list, currentPage} = this.data;
    singleRequest({
      url: config.API.bespeak.list,
      postData: {
        pageSize: $this.data.pageSize || 10,
        currentPage: $this.data.currentPage || 1
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
        if (paged) {
          list = list.concat(data)
        } else {
          list = data
        }
        $this.setData({
          list, 
          nocontent: (currentPage == 1 && data.length == 0)
        })
      }, 
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
        $this.setData({
          currentPage: currentPage > 1 ? (currentPage - 1) : currentPage,
          nocontent: ($this.data.currentPage == 1)
        })
      }
    })
  },
  //预约删除
  deleteItemFn(e) {
    const { id, state} = e.currentTarget.dataset;
    //只有状态不是1 的才能继续删除
    if (state != 0) return false;
    const $this = this;
    singleRequest({
      url: config.API.bespeak.cancel,
      postData: {
        bespeakId: id
      },
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
  },
  lowerFn() {
    const { currentPage } = this.data
    this.setData({
      currentPage: currentPage + 1
    }, () => {
      this.getBespeakFn(paged)
    })
  }
})