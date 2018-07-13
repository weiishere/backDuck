Page({
  data: {
    allinputF1: true,
    pwdArr: [],
    againPwdArr: [],
    inputStr: '',
    againInputStr: '',
    focusF: [],
    allinput: '',
  },
  onLoad: function (options) {
    
  },
  passInput(e) {
    const dType = e.target.dataset.type;
    console.log('dType: ', dType)
    const value = e.detail.value;
    const num = e.detail.cursor - 1;
    const tempArr = [];
    let data = '';
    // for (let i = 0; i <= num; i++) {
    //   tempArr.push(value.substring(i, i + 1))
    // }

    // if (tempArr.length >= 6) {
    //   data = {
    //     inputSrr: value,
    //     allinput: value,
    //   }
    // } else {
    //   data = {
    //     inputSrr: value,
    //     allinput: ''
    //   }
    // }
    // if (dType == 'againPwd') {
    //   data['againPwdArr'] = tempArr
    // } else {
    //   data['pwdArr'] = tempArr
    // }
    // console.log(`${dType}密码输入完成: ${tempArr}`)
    // this.setData(data)
  },
  allInputFn(e) {
    const index = e.target.dataset.index;
    console.log(index)
    var focusF = http.forC(that.data.focusF);
    var pwdArr = that.data.pwdArr;
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
    console.log(e.target.dataset)
    this.setData({
      allinputF1: true
    })
  },

})