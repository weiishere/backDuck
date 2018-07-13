Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 弹窗标题
    title: {
      type: String,
      value: '支付密码'
    },
    dType: {
      type: String,
      value: 'paypwd'
    }
  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    allinputF1: true,
    pwdArr: [],
    inputStr: '',
    focusF: [],
    allinput: '',
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    passInput(e) {
      const dType = e.target.dataset.type;
      console.log('dType: ', dType)
      const value = e.detail.value;
      const num = e.detail.cursor - 1;
      const tempArr = [];
      let data = '';
      for (let i = 0; i <= num; i++) {
        tempArr.push(value.substring(i, i + 1))
      }
      if (tempArr.length >= 6) {
        data = {
          inputSrr: value,
          allinput: value,
          pwdArr: tempArr
        }
      } else {
        data = {
          inputSrr: value,
          allinput: '',
          pwdArr: tempArr
        }
      }
      console.log(`${dType}密码输入完成: ${tempArr}`)
      this.setData(data)
    },
    allInputFn(e) {
      const index = e.target.dataset.index;
      console.log(index)
      // var focusF = http.forC(that.data.focusF);
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

  }
})