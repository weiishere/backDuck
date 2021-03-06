// pages/home/home.js.js
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
    list: [],
    chooseIndex: 9,
    currentPage: 1,
    pageSize: 10,
    nocontent: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    wx.showLoading({
      title: '',
    })
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res)
        wx.createSelectorQuery().select('.order_header').boundingClientRect(function (rect) {
          // console.log(rect)
          that.setData({
            scrollHeight: res.windowHeight - rect.bottom - 5
          })
        }).exec();
      },
    })
  },
  onShow() {
    this.getOrderListFn()
  },
  getOrderListFn (paged = false) {
    const $this = this;
    let { list, chooseIndex, currentPage } = this.data
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url: config.API.order.list,
      method: 'get',
      postData: {
        pageSize: $this.data.pageSize,
        currentPage: $this.data.currentPage,
        state: (chooseIndex == 9 ? '' : chooseIndex)
      },
      success: (res) => {
        wx.hideLoading()
        const data = res.data;
        if (paged) {
          list = list.concat(data)
        } else {
          list = data
        }
        $this.setData({
          list,
          currentPage: (currentPage > 1 && data.length == 0) ? (currentPage - 1) : currentPage,
          nocontent: (currentPage == 1 && data.length == 0)
        })
      },
      error(res) {
        $this.setData({
          currentPage: currentPage > 1 ? (currentPage - 1) : currentPage,
          nocontent: ($this.data.currentPage == 1)
        })
      }
    })
  },
  orderTypeChoose: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      chooseIndex: index,
      nocontent: false,
      list: []
    }, ()=>{
      this.getOrderListFn()
    })
  },
  gotoPage: function(e) {
    const { page, orderid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `${page}?orderId=${orderid}`
    });
  },
  lowerFn(){
    const { currentPage} = this.data
    this.setData({
      currentPage: currentPage + 1
    }, ()=>{
      this.getOrderListFn(true)
    })
  }
})