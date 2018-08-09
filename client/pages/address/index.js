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
    wx.setNavigationBarTitle({
      title: '收货地址',
    })
    if ( options && options.pageorigin == "reservation") {
      this.setData({
        pageorigin: options.pageorigin
      })
    }
  },
  onShow(){
    this.getAddressListFn()
  },
  //获取列表
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
        showModel("错误", res.msg || '报错了~');
      }
    })
  },
  //选择地址的时候调用
  addressdetilFn(e){
    const { item } = e.currentTarget.dataset;

    if (this.data.pageorigin) {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.setData({
        currData: item
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //操作单个地址信息
  operationAddressFn(e){
    const { id, key, item } = e.currentTarget.dataset;
    if (key != 'edit') {
      this.setAddressByIdFn(key, id)
    } else {
      wx.navigateTo({
        url: `/pages/address/add/index?pageorigin=edit&id=${id}`,
      })
    }
  },
  setAddressByIdFn(key, id){
    console.log(key, id)
    const $this = this;
    let url = config.API.address.deleteAddress
    if (key == 'default') {
      url = config.API.address.setdefault;
    }
    singleRequest({
      url,
      postData: {
        addressId: id
      },
      success: (res) => {
        $this.getAddressListFn()
      },
      error(res) {
        // $this.getAddressListFn()
      }
    })
  }
})