import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
import { hexMD5 } from '../../utils/md5.js';
const app = getApp()

Page({
  data: {
    OneInputFocus: true,
    TwoInputFocus: false,
    OnePwdArr: [],
    TwoPwdArr: [],
    OneInputStr: '',
    TwoInputStr: '',
    OneFocusF: [],
    TwoFocusF: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设置支付密码',
    })
  },
  inputEventFn(e) {
    console.log(e.detail)
  },
  passInput(e) {
    const {itype} = e.currentTarget.dataset
    const value = e.detail.value;
    const num = e.detail.cursor - 1;
    const tempArr = [];
    let data = {};
    for (let i = 0; i <= num; i++) {
      tempArr.push(value.substring(i, i + 1))
    }

    if (itype == 'one') {
      data['OneInputStr'] = value
      data['OnePwdArr'] = tempArr
    } else {
      data['TwoInputStr'] = value
      data['TwoPwdArr'] = tempArr
    }

    if (tempArr.length >= 6) {
      console.log(`密码输入完成: ${tempArr.join('')}`)
    }
    this.setData(data)
  },

  focusInput(e) {
    const {itype} = e.currentTarget.dataset
    let data = {}
    if (itype == 'one') {
      data['OneInputFocus'] = true
      data['TwoInputFocus'] = false
    } else {
      data['OneInputFocus'] = false
      data['TwoInputFocus'] = true
    }
    this.setData(data)
  },
  nextBtnClickFn() {
    const $this = this;
    const { OneInputStr, TwoInputStr } = this.data;
    const OnePayPWD = hexMD5(OneInputStr)
    const TwoPayPWD = hexMD5(TwoInputStr)
    if (OnePayPWD === TwoPayPWD) {
      this.savePayPWDFn(OnePayPWD)
    } else {
      showModel({
        title: "错误",
        content: "两次密码输入不一致~"
      });
    }
  },

  //获取会员信息
  savePayPWDFn(PayPWD) {
    const $this = this;
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url: config.API.setting.setPayPWD,
      postData: {
        payPassword: PayPWD
      },
      success: (res) => {
        showModel({
          title: "成功",
          content: "支付密码设置成功~"
        }, () => {
          wx.navigateBack({
            delta: 1
          })
        });
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