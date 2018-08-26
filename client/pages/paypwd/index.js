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
    wx.setNavigationBarTitle({
      title: '支付密码'
    })
  },
  inputEventFn(e){
    console.log(e.detail)
  },

})