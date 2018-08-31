// pages/bindphone/index.js
import {
  showModel,
  showSuccess,
  singleRequest,
  formatDateTime
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  data: {
    mobile: '',
    smsCode: '',
    countNum: 60,
    btnText: '获取验证码'
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '修改手机号',
    })
  },
  inputChangeFn(e){
    const {id} = e.currentTarget.dataset
    const {value} = e.detail
    console.log(id, '====' ,value)
    this.setData({
      [id]: value
    })
  },
  clickGetSMSCodeFn(){
    if (this.data.countNum == 60) {
      this.getSMSCodeFn()
    }
  },
  countdownFn(){
    const $this = this;
    let { countNum } = this.data
    const countId = setInterval(() => {
      if (countNum <= 0) {
        $this.setData({
          countNum: 60,
          btnText: '获取验证码'
        })
        clearInterval(countId)
      } else {
        $this.setData({
          countNum: (countNum -= 1),
          btnText: `${countNum}s`
        })
      }
    }, 1000)
  },
  getSMSCodeFn(){
    const $this = this;
    const {mobile} = this.data;
    const RegMobile = /^1[3456789]\d{9}$/;
    if (!RegMobile.test(mobile)) {
      showModel({
        title: "错误",
        content: '请输入正确的手机号~'
      });
      return false
    }
    singleRequest({
      url: `${config.API.verification.sendSMSCode}/${mobile}`,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        $this.countdownFn()
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
  nextBtnClickFn() {
    const { mobile, smsCode } = this.data;
    const RegMobile = /^1[3456789]\d{9}$/;
    if (!RegMobile.test(mobile)) {
      showModel({
        title: "错误",
        content: '手机号错误~'
      });
    } else if (smsCode.length < 6) {
      showModel({
        title: "错误",
        content: '短信验证码错误~'
      });
    } else {
      this.checkSMSCodeFn(mobile, smsCode)
    }
  },
  checkSMSCodeFn(mobile, smsCode){
    const $this = this;
    singleRequest({
      url: config.API.verification.checkSMSCode,
      postData: {
        phone: mobile,
        verificationCode: smsCode
      },
      success: (res) => {
        showSuccess('修改手机号成功~');
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500);
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  }
})