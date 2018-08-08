var dateTimePicker = require('../../utils/dateTimePicker.js');
import {
  showModel,
  showSuccess,
  singleRequest
} from '../../utils/util.js';
import * as config from '../../config.js';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    haveAddressList: false,
    defaultData: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '预约取件',
    });

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
    this.getAddressListFn()
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  chooseAddressEventFn(){
    wx.navigateTo({
      url: '/pages/address/index?pageorigin=reservation',
    })
  },
  //获取地址列表
  getAddressListFn(){
    singleRequest({
      url: config.API.address.list,
      postData: {
      },
      method: 'get',
      success: (res) => {
        const data = res.data;
        let defaultdata = '';
        data.forEach((item, index) => {
          if (item.isDefault == 1) {
            defaultdata = item
          }
        })
        this.data.defaultData = defaultdata;
      },
      error(res){
        console.log('错误', res)
      }
    })
  },
  //确认预约取件
  submitClickEvent(){
    const { defaultData } = this.data;
    if (defaultData && defaultData.id) {
      this.addBespeakFn()
    } else {
      showModel("错误", "请选择地址~");
    } 
  },
  // 提交数据
  addBespeakFn(){
    const timestamp = Date.parse(new Date()),
          { defaultData } = this.data;
    singleRequest({
      url: config.API.bespeak.add,
      postData: {
        bespeakNo: '',
        takePartTime: timestamp,
        address: encodeURIComponent(defaultData),  
        remarks: "",
        gmtCreate: '',
        gmtModified: '',
        state: 0
      },
      success: (res) => {
        console.log('成功', res)
      },
      error(res) {
        console.log('错误', res)
      }
    })
  }
})