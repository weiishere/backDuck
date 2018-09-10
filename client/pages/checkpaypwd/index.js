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
    inputFocus: true,
    pwdArr: [],
    inputStr: '',
    focusF: [],
    allinput: '',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '支付密码'
    })
  },
  inputEventFn(e){
    console.log(e.detail)
  },
  passInput(e) {
    const value = e.detail.value;
    const num = e.detail.cursor - 1;
    const tempArr = [];
    let data = '';
    for (let i = 0; i <= num; i++) {
      tempArr.push(value.substring(i, i + 1))
    }
    if (tempArr.length >= 6) {
      data = {
        inputStr: value,
        allinput: value,
        pwdArr: tempArr
      }
      console.log(`密码输入完成: ${tempArr.join('')}`)
    } else {
      data = {
        inputStr: value,
        allinput: '',
        pwdArr: tempArr
      }
    }
    this.setData(data)
  },
  allInputFn(e) {
    const index = e.target.dataset.index;
    // var focusF = http.forC(that.data.focusF);
    var pwdArr = this.data.pwdArr;
    var value = e.detail.value
    if (pwdArr[index]) {
      pwdArr[index] = '';
      focusF[index] = '1';
    } else {
      pwdArr[index] = value;
      focusF[index + 1] = '1';
    }
    this.setData({
      focusF: focusF,
      pwdArr: pwdArr
    })
    console.log(index)
  },
  focusInput(e) {
    this.setData({
      inputFocus: true
    })
  },
  nextBtnClickFn(){
    const { inputStr} = this.data;
    console.log(this.data)
    if (inputStr < 6) {
      showModel({
        title: "错误",
        content: "支付密码输入错误~"
      });
      return false
    }
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url: config.API.setting.checkPayPWD,
      postData: {
        payPassword: hexMD5(inputStr)
      },
      success: (res) => {
        wx.redirectTo({
          url: '/pages/setpaypwd/index'
        })
      }
    })
  }
})