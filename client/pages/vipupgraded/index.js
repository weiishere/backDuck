// pages/vipupgraded/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  data: {
    level: 1,
    list: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '会员升级',
    })
    this.getVipList()
  },
  getVipList() {
    const $this = this;
    singleRequest({
      url: config.API.vip.list,
      postData: {
      },
      method: 'GET',
      success: (res) => {
        let data = res.data;
        console.log(data)
        if (data) {
          data.map((item, index)=>{
            if (item.vipType == 1) {
              item.classname = 'gold'
            } else if (item.vipType == 2) {
              item.classname = 'platinum'
            } else if (item.vipType == 3) {
              item.classname = 'diamonds'
            }
            return item
          })
          $this.setData({
            list: data
          })
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
  //立即开通按钮
  vipUpgradeFn(e){
    const $this = this;
    const { vipid } = e.currentTarget.dataset;
    console.log('vipid: ', vipid)
    console.log('app.userInfo.user: ', app.userInfo.user)
    if (app.userInfo && app.userInfo.user) {
      if (app.userInfo.user.vipId != null && app.userInfo.user.vipId <= vipid) {
        showModel({
          title: "对不起",
          content: '不能重复购买~'
        });
        return false;
      }
      singleRequest({
        url: config.API.vip.open,
        postData: {
          vipId: vipid
        },
        method: 'GET',
        success: (res) => {
          let data = res.data;
          $this.payFn(data)
        },
        error(res) {
          showModel({
            title: "错误",
            content: res.msg || '报错了~'
          });
        }
      })

    }
  },
  payFn(data) {
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': data.signType,
      'paySign': data.paySign,
      'success': function (res) {
        console.log('success: ', res)
        showModel({
          title: "成功",
          content: '会员升级成功~'
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