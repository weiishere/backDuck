// pages/recharge/index.js
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
    realAccountBalance: '0.00',
    currentPage: 1,
    pageSize: 10,
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '余额充值'
    })
    this.getMyBalanceFn()
    this.getPayRecordsFn()
  },
  //获取账户余额
  getMyBalanceFn() {
    const $this = this;
    singleRequest({
      url: config.API.mybalance,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        console.log(data)
        $this.setData({
          realAccountBalance: data.realAccountBalance,
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
  //获取交易记录
  getPayRecordsFn() {
    const $this = this;
    singleRequest({
      url: config.API.pay.record,
      postData: {
        pageSize: $this.data.pageSize || 10,
        currentPage: $this.data.currentPage|| 1
      },
      method: 'get',
      success: (res) => {
        let data = res.data;
        data.map((item, index) => {
          item.createTime = formatDateTime(item.gmtCreate)
          return item
        })
        $this.setData({
          records: data
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
  //滚动加载更多 分页之类的
  lower: function (e) {
    console.log(e)
  },
  rechargeClickEventFn(){
    wx.navigateTo({
      url: '/pages/recharge/index'
    })
  }
})