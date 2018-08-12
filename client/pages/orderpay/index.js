// pages/orderpay/index.js
import {
  showModel,
  showSuccess,
  singleRequest,
  formatDateTime
} from '../../utils/util.js';
import * as config from '../../config.js';
import { hexMD5 } from '../../utils/md5.js';
const app = getApp()

Page({
  data: {
    money: '',
    orderNo: '',
    payway: 'wechat',
    payBtnLock: true
  },
  onLoad: function (options) {
    console.log(options)
    if (options.money && options.orderNo) {
      this.setData({
        money: options.money,
        orderNo: options.orderNo
      })
    } else {
      showModel({
        title: "失败",
        content: '缺少关键数据~'
      }, () => {
        wx.navigateBack({
          delta: 1
        })
      });
    }
  },
  togglePayWayFn(e) {
    const {  payway } = this.data;
    const { way } = e.currentTarget.dataset
    this.setData({
      payway: way,
      payBtnLock: (way == payway) ? false : true
    })
    console.log(way)
  },
  payBtnClickFn(){
    const $this = this
    const { payBtnLock, payway } = this.data;
    if (!payBtnLock) return false;
    this.setData({
      payBtnLock: false
    }, () => {
      if (payway == 'wechat') {
        this.payFn()
      } else {
        $this.balancePayModelFn()
      }
    })
  },
  balancePayModelFn() {
    // this.payFn()
  },
  payFn() {
    const $this = this;
    const { payway, orderNo } = this.data;
    let url = '';
    let jsondata = {
      orderId: orderNo
    };
    if (payway == 'wechat') {
      url = config.API.pay.wechatPay
    } else {
      url = config.API.pay.balancePay
      jsondata['payPassword'] = hexMD5(paypwd)
    }
    singleRequest({
      url,
      method: 'get',
      postData: jsondata,
      success: (res) => {
        if (payway == 'wechat') {
          $this.wechatPayFn()
        } else {
          showModel({
            title: "成功",
            content: "余额支付成功~"
          }, () => {
            wx.navigateBack({
              delta: 1
            })
          });
        }
      },
      error(res) {
      }
    })
  },
  wechatPayFn(data) {
    wx.requestPayment({
      'timeStamp': data.timestamp,
      'nonceStr': data.nonceStr,
      'package': `prepay_id=${data.prepayId}`,
      'signType': 'MD5',
      'paySign': data.sign,
      'success': function (res) {
        showModel({
          title: "成功",
          content: "支付成功~"
        }, () => {
          wx.navigateBack({
            delta: 1
          })
        });
      },
      'fail': function (res) {
        console.log('fail: ', res)
      }
    })
  }
})