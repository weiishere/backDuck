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
    pageorigin: '',
    btnText: '获取验证码',
    btnIsClick: false
  },
  onLoad: function (options) {
    console.log(options.pageorigin)
    this.setData({
      pageorigin: options.pageorigin
    })
    wx.setNavigationBarTitle({
      title: '获取验证码',
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
      this.setData({
        btnIsClick: true
      })
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
    singleRequest({
      url: `${config.API.verification.sendBindingSMSCode}`,
      postData: {
      },
      method: 'GET',
      success: (res) => {
        const data = res.data;
        $this.setData({
          mobile: data
        }, () => {
          $this.countdownFn()
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
  nextBtnClickFn() {
    const { mobile, smsCode, btnIsClick } = this.data;
    const RegMobile = /^1[3456789]\d{9}$/;
    if (!btnIsClick) {
      showModel({
        title: "错误",
        content: '请先获取短信验证码~'
      });
    } else if (!RegMobile.test(mobile)) {
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
        const data = res.data;
        if (this.data.pageorigin == 'forgetpaypwd' || this.data.pageorigin == 'setpaypwd') {
          wx.redirectTo({
            url: '/pages/setpaypwd/index',
          })
        }
        if (this.data.pageorigin == 'changephone') {
          wx.redirectTo({
            url: '/pages/changephone/index',
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
  }
})