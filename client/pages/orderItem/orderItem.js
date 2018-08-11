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
    this.getOrderDetailFn(options.orderId)
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
          namemobile: jsonAddress.attn + ' ' + jsonAddress.mobile,
          address: jsonAddress.area + jsonAddress.address,
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
  }
})