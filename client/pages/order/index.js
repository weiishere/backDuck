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
    wx.showLoading({
      title: '',
    })
    this.getOrderListFn()
  },

  getOrderListFn (){
    const $this = this;
    let { list, chooseIndex} = this.data
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
        data.map((item, index)=>{
          if (item.state == 0) {
            item.stateText = '待取件'
          } else if (item.state == 1) {
            item.stateText = '待处理'
          } else if (item.state == 2) {
            item.stateText = '待收件'
          } else if (item.state == 3) {
            item.stateText = '已完成（已收款）'
          }
          return item
        })
        list = list.concat(data)
        $this.setData({
          list,
          nocontent: ($this.data.currentPage == 1 && data.length == 0)
        })
      },
      error(res) {
        $this.setData({
          nocontent: ($this.data.currentPage == 1)
        })
      }
    })
  },
  orderTypeChoose: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      chooseIndex: index,
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
  }
})