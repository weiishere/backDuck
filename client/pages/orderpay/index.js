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
    orderId: '',
    orderNo: '',
    payway: 'wechat',
    paypwd: '',
    payBtnLock: true,
    modalshow: true,
    havePayPWD: false,
    realAccountBalance: 0
  },
  onLoad: function (options) {
    const that = this;
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    wx.showLoading({
      title: '',
    })
    if (options.money && options.orderId && options.orderNo) {
      this.setData({
        money: options.money,
        orderId: options.orderId,
        orderNo: options.orderNo
      }, () => {
        that.havePayPWDFn()
        that.getMyBalanceFn()
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
    const { payway, havePayPWD, realAccountBalance } = this.data;
    const { way } = e.currentTarget.dataset
    wx.showLoading({
      title: '',
    })
    if ((!havePayPWD || realAccountBalance == 0) && way == 'blanace') {
      wx.hideLoading()
      let title = "",
          content =  '';
      if (!havePayPWD) {
        title = "未设置支付密码",
        content = '请设置支付密码~';
      } else if (realAccountBalance == 0) {
        title = "账户余额为零",
        content = '不能使用余额支付~';
      }
      showModel({
        title,
        content
      }, () => {
        if (!havePayPWD) {
          wx.redirectTo({
            url: '/pages/checkSMSCode/index?pageorigin=setpaypwd'
          })
        } else if (realAccountBalance == 0) {
          wx.redirectTo({
            url: '/pages/recharge/index'
          })
        }
      });
      return false;
    }
    wx.hideLoading()
    this.setData({
      payway: way,
      payBtnLock: (way == payway) ? false : true
    })
  },
  payBtnClickFn(){
    const that = this
    const { payBtnLock, payway } = this.data;
    if (!payBtnLock) return false;
    this.setData({
      payBtnLock: false
    }, () => {
      if (payway == 'wechat') {
        this.payFn()
      } else {
        that.balancePayModelFn()
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
    const that = this;
    const { payway, orderId, paypwd } = this.data;
    let url = '';
    let jsondata = {
      orderId: orderId
    };
    if (payway == 'wechat') {
      url = config.API.pay.wechatPay
    } else {
      url = config.API.pay.balancePay
      jsondata['payPassword'] = hexMD5(paypwd)
    }
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url,
      postData: jsondata,
      success: (res) => {
        if (payway == 'wechat') {
          that.wechatPayFn(res.data)
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
  },
  //获取用户是否有支付密码
  havePayPWDFn() {
    const that = this;
    singleRequest({
      url: config.API.setting.isHavePayPWD,
      postData: {
      },
      method: 'GET',
      success: (res) => {
        let data = res.data;
        that.setData({
          havePayPWD: data
        })
      }
    })
  },
  //获取账户余额
  getMyBalanceFn() {
    const that = this;
    singleRequest({
      url: config.API.mybalance,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        console.log('getMyBalanceFn: ', data)
        that.setData({
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
})