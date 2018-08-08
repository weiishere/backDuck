// pages/address/add/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../../utils/util.js';
import * as config from '../../../config.js';
const app = getApp()
Page({
  data: {
    attn: '',
    mobile: '',
    email: '',
    area: '',
    address: '',
    isDefault: false
  },
  onLoad: function (options) {
    console.log(options)
    let title = '添加地址'
    if (options.pageorigin == 'edit') {
      title = '编辑地址'
      this.getAddressById(options.id)
    }
    wx.setNavigationBarTitle({
      title
    })
  },
  // 提交数据
  getAddressById(id) {
    singleRequest({
      url: config.API.address.getAddressByid+'/'+id,
      postData: {},
      success: (res) => {
        console.log('成功', res)
      },
      error(res) {
        console.log('错误', res)
      }
    })
  },
  //输入
  inputChangeFn(e){
    const value = e.detail.value;
    const id = e.target.id;
    this.setData({
      [id]: value
    })
    console.log(this.data)
  },
  //设置为默认地址
  setdefaultFn(){
    const { isDefault } = this.data;
    this.setData({
      isDefault: !isDefault
    })
    console.log(this.data.isDefault)
  },
  //地址选择器
  bindAreaChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      area: e.detail.value
    })
  },
  //提交按钮
  submitAddressFn(){
    const {
      attn,
      mobile,
      email,
      area,
      address,
      isDefault
    } = this.data;
    if (!attn || attn.length < 2) {
      showModel("错误", "请输入正确的名字~");
    } else if (!mobile || mobile.length < 11) {
      showModel("错误", "请输入正确的联系方式~");
    } else {
      this.addAddressFn({
        attn,
        mobile,
        email,
        area: area.join(''),
        address,
        isDefault
      })
    }
  },
  // 提交数据
  addAddressFn(parameter) {
    singleRequest({
      url: config.API.address.add,
      postData: parameter,
      success: (res) => {
        console.log('成功', res)
      },
      error(res) {
        console.log('错误', res)
      }
    })
  }
})