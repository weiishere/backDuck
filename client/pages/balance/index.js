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
    records: [],
    scrollHeight: '',
    nocontent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.setNavigationBarTitle({
      title: '余额充值'
    })
    wx.getSystemInfo({
      success: function (res) {
        let height = res.windowHeight;
        console.info('height: ', height);
        wx.createSelectorQuery().selectAll('#scrollList').boundingClientRect((rects) => {
          rects.forEach((rect) => {
            // console.log(rect)
            that.setData({
              scrollHeight: res.windowHeight - rect.top - 20
            });
          })
        }).exec();
      }
    });
  },
  onShow () {
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
  getPayRecordsFn (paged = false) {
    const $this = this;
    let { records, currentPage, pageSize } = this.data;
    singleRequest({
      url: config.API.pay.record,
      postData: {
        pageSize: pageSize || 10,
        currentPage: currentPage || 1
      },
      method: 'get',
      success: (res) => {
        let data = res.data;
        data.map((item, index) => {
          item.createTime = formatDateTime(item.gmtCreate)
          return item
        })
        if (paged) {
          records = records.concat(data)
        } else {
          records = data
        }
        $this.setData({
          records,
          currentPage: (currentPage > 1 && data.length == 0) ? (currentPage - 1) : currentPage,
          nocontent: (currentPage == 1 && res.data.length == 0)
        })
      },
      error(res) {
        $this.setData({
          currentPage: currentPage > 1 ? (currentPage - 1) : currentPage,
          nocontent: (currentPage == 1)
        }, () => {
          showModel({
            title: "错误",
            content: res.msg || '报错了~'
          });
        })
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
  },
  lowerFn() {
    const { currentPage } = this.data
    this.setData({
      currentPage: currentPage + 1
    }, () => {
      this.getPayRecordsFn(true)
    })
  }
})