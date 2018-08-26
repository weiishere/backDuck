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
    paypwd: '',
    payBtnLock: true,
    modalshow: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
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
    this.setData({
      modalshow: false
    })
  },
  payFn() {
    const $this = this;
    const { payway, orderNo, paypwd } = this.data;
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
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': data.signType,
      'paySign': data.paySign,
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
  },
  // 余额支付
  //输入完成的回调
  completeFn(e) {
    console.log('completeFn ：', e.detail.data)
    if (e.detail && e.detail.data.length == 6) {
      this.setData({
        paypwd: e.detail.data
      }, () => {
        this.payFn()
      })
    }
  },
  //关闭之后执行的方法，重置按钮状态
  closeAfterFn(){
    this.setData({
      payBtnLock: true,
      modalshow: true
    })
  }
})