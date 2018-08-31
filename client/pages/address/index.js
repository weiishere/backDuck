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
    list: [],
    nocontent: false,
    pageSize: 10,
    currentPage: 1,
    scrollHeight: ''
  },
  onLoad: function (options) {
    const that = this;
    wx.setNavigationBarTitle({
      title: '收货地址',
    })
    if ( options && options.pageorigin == "reservation") {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight,
            pageorigin: options.pageorigin
          })
        },
      })
    }
  },
  onShow(){
    this.getAddressListFn()
  },
  //获取列表
  getAddressListFn(paged = false) {
    const $this = this;
    let { list, currentPage } = this.data
    singleRequest({
      url: config.API.address.list,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        if (paged) {
          list = list.concat(data)
        } else {
          list = data
        }
        $this.setData({
          list,
          currentPage: currentPage > 1 ? (currentPage - 1) : currentPage,
          nocontent: (currentPage == 1 && data.length == 0)
        })
      },
      error(res) {
        $this.setData({
          nocontent: ($this.data.currentPage == 1)
        })
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
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
      if (key == 'delete') {
        showModel({
          title: '',
          content: '确定要删除该地址吗？',
          showCancel: true
        }, (res) => {
          this.setAddressByIdFn(key, id)
        });
      } else {
        this.setAddressByIdFn(key, id)
      }
    } else {
      wx.navigateTo({
        url: `/pages/address/add/index?pageorigin=edit&id=${id}`,
      })
    }
  },
  setAddressByIdFn(key, id){
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
      }
    })
  },
  lowerFn() {
    const { currentPage } = this.data
    this.setData({
      currentPage: currentPage + 1
    }, () => {
      this.getAddressListFn(true)
    })
  }
})