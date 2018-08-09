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
    id: '',
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
      this.setData({
        id: options.id
      }, () => {
        this.getAddressById(options.id)
      })
    }
    wx.setNavigationBarTitle({
      title
    })
  },
  // 根据ID 获取需要编辑的信息
  getAddressById(id) {
    const $this = this;
    singleRequest({
      url: config.API.address.getAddressByid+'/'+id,
      method: 'GET',
      postData: {},
      success: (res) => {
        // console.log('成功', res)
        let data = {};
        for (let key in res.data) {
          console.log('key: ', key, $this.data[key])
          if ($this.data[key] != undefined) {
            data[key] = res.data[key]
          }
        }
        console.log(data)
        $this.setData(data)
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
      id,
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
    } else if (!area) {
      showModel("错误", "请输入选择所在地区~");
    } else if (!address) {
      showModel("错误", "请输入详细地址~");
    } else {
      let data = {
        attn,
        mobile,
        email,
        area: (area instanceof Array ? area.join('') : area),
        address,
        areaCode: 1001,
        isDefault: isDefault ? 1 : 0
      };
      if (id) {
        data['id'] = id
      }
      this.addAddressFn(data)
    }
  },
  // 提交数据
  addAddressFn(parameter) {
    singleRequest({
      url: parameter.id ? config.API.address.edit : config.API.address.add,
      postData: {
        jsonData: JSON.stringify(parameter)
      },
      success: (res) => {
        showModel("成功", `地址${parameter.id ? '编辑' : '新增'}成功~`, (res) => {
          console.log(res.confirm)
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        });
      },
      error(res) {
        console.log('错误', res)
      }
    })
  }
})