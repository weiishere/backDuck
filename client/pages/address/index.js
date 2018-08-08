// pages/address/list/index.js
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({
  data: {
    pageorigin: '',
    list: ''
  },
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '收货地址',
    })
    if ( options && options.pageorigin == "reservation") {
      this.setData({
        pageorigin: options.pageorigin
      })
    }
    this.getAddressListFn()
    // let pageorigin = options.pageorigin
  },
  getAddressListFn() {
    const $this = this;
    singleRequest({
      url: config.API.address.list,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        if (data) {
          $this.setData({
            list: data
          })
        } else {
          showModel("错误", "收货地址为空~");
        }

      },
      error(res) {
        // console.log(res)
        res.data = [
          {
            "id": 3,
            "userId": null,
            "attn": "张坤",
            "mobile": "13808218470",
            "email": "793753529@qq.com",
            "address": "机场路巴黎都市二期",
            "area": "四川省成都市双流区",
            "areaCode": "510116",
            "alias": "家",
            "isDefault": 0,
            "gmtCreate": 1531963551000,
            "gmtModified": 1531963554000
          },
          {
            "id": 4,
            "userId": null,
            "attn": "张坤",
            "mobile": "18140010828",
            "email": "793753529@qq.com",
            "address": "交子大道88号AFC中航国际广场B座",
            "area": "四川省成都市武侯区",
            "areaCode": "510107",
            "alias": "公司",
            "isDefault": 1,
            "gmtCreate": 1531963722000,
            "gmtModified": 1531963719000
          }
        ]
        const data = res.data;
        console.log(data)
        if (data) {
          $this.setData({
            list: data
          })
        } else {
          showModel("错误", "收货地址为空~");
        }
      }
    })
  },
  //选择地址的时候调用
  addressdetilFn(e){
    
  },
  //操作单个地址信息
  operationAddressFn(e){
    const { id, key, item } = e.target.dataset;
    console.log(item)
    if (key != 'edit') {
      this.setAddressByIdFn(key)
    } else {
      wx.navigateTo({
        url: `/pages/address/add/index?pageorigin=edit&id=${id}`,
      })
    }
  },
  setAddressByIdFn(key){
    const $this = this;
    let url = config.API.address.deleteAddress
    if (key == 'default') {
      url = config.API.address.setdefault
    }
    singleRequest({
      url,
      postData: {
      },
      method: 'get',
      success: (res) => {
        // $this.getAddressListFn()
      },
      error(res) {
        // $this.getAddressListFn()
      }
    })
  }
})