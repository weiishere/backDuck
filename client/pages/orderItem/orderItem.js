// pages/home/home.js.js
import {
  showModel,
  showSuccess,
  singleRequest,
  formatDateTime
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      orderId: '',
      chooseIndex: "0",
      namemobile:'',
      address: '',
      orderNo: '' ,
      gmtCreate: '',
      orderItems: '',
      state: '',
      stateDes: '',
      realOrderMoney: '0.00'
    },
    orderTypeChoose: function (e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
          chooseIndex: index
      })
    },
  onLoad: function (options) {
    // this.getOrderDetailFn(options.orderId)
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
    }
  },
  onShow(){
    const { orderId } = this.data
    if ( orderId ) {
      this.getOrderDetailFn(orderId)
    } else {
      console.log('参数不正确')
    }
  },

  getOrderDetailFn(orderId) {
    const $this = this;
    let { list } = this.data
    singleRequest({
      url: `${config.API.order.detail}/${orderId}`,
      method: 'get',
      postData: {
      },
      success: (res) => {
        const { 
          jsonAddress, 
          orderNo, 
          gmtCreate, 
          orderItems,
          state,
          stateDes,
          realOrderMoney
        } = res.data;
  
        $this.setData({
          namemobile: jsonAddress ? (jsonAddress.attn + ' ' + jsonAddress.mobile) : '',
          address: jsonAddress ? (jsonAddress.area + jsonAddress.address) : '',
          orderNo,
          createTime: formatDateTime(gmtCreate),
          orderItems,
          state,
          stateDes,
          realOrderMoney
        })
      },
      error(res) {

      }
    })
  },
  //确认签收
  confirmReceiptFn(){
    const { orderId, orderNo, realOrderMoney} = this.data
    wx.navigateTo({
      url: `/pages/orderpay/index?money=${realOrderMoney}&orderId=${orderId}&orderNo=${orderNo}`,
    })
  },
  lookBigPicFn(e){
    const { piclist} = e.currentTarget.dataset
    wx.previewImage({
      urls: piclist
    })
    console.log(piclist)
  }
})