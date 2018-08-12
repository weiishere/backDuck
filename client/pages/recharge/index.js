// pages/recharge/index.js
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
    activityList: [],
    rechargeId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '余额充值'
    })
    this.getRechargeListFn()
  },

  //获取活动列表
  getRechargeListFn() {
    const $this = this;
    singleRequest({
      url: config.API.recharge.activity,
      postData: {
      },
      method: 'get',
      success: (res) => {
        let data = res.data;
        console.log(data)
        if (data) {
          $this.setData({
            activityList: data
          })
        } else {
          showModel({
            title: "错误",
            content: "收货地址为空~"
          });
        }

      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
  //立即充值按钮
  rechargePayFn() {
    const $this = this;
    if (!$this.data.rechargeId) {
      showModel({
        title: "失败",
        content: "请选择充值金额~"
      });
      return false;
    }
    singleRequest({
      url: config.API.pay.recharge,
      postData: {
        activityId: $this.data.rechargeId
      },
      success: (res) => {
        $this.payFn(res.data)
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
  chooseRechargeMoneyFn(e){
    const { id } = e.currentTarget.dataset
    const { activityList } = this.data;
    const tempArr = [];
    let rechargeId = '';
    activityList.forEach((item, index)=>{
      if (item.id == id) {
        rechargeId = id
      }
      tempArr.push(Object.assign({ ...item }, { activity: (item.id == id)}))
    })
    this.setData({
      rechargeId,
      activityList: tempArr
    })
  },
  payFn(data) {
    wx.requestPayment({
      'timeStamp': data.timestamp,
      'nonceStr': data.nonceStr,
      'package': `prepay_id=${data.prepayId}`,
      'signType': 'MD5',
      'paySign': data.sign,
      'success': function (res) {
        showModel({
          title: "成功",
          content: "充值成功~"
        }, () => {
          wx.redirectTo({
            url: '/pages/blanace/index',
          })
        });
      },
      'fail': function (res) {
        console.log('fail: ', res)
      }
    })
  }
})