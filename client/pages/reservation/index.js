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
    currData: ''
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
    this.setData({
      time: e.detail.value
    })
  },
  chooseAddressEventFn(){
    wx.navigateTo({
      url: '/pages/address/index?pageorigin=reservation',
    })
  },

  //确认预约取件
  submitClickEvent(){
    const { currData } = this.data;
    if (currData && currData.id) {
      this.addBespeakFn()
    } else {
      showModel({
        title: "错误",
        content: '请选择地址~'
      });
    } 
  },
  // 提交数据
  addBespeakFn(){
    const timestamp = Date.parse(new Date()),
          { currData } = this.data;

    singleRequest({
      url: config.API.bespeak.add,
      postData: {
        jsonData: JSON.stringify({
          bespeakNo: '',
          takePartTime: timestamp,
          address: JSON.stringify(currData),
          remarks: "",
          gmtCreate: '',
          gmtModified: '',
          state: 0
        })
      },
      success: (res) => {

        showModel({
          title: "成功",
          content: '预约取件成功'
        }, (res) => {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/myreservation/index',
            })
          }
        });
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '出错啦'
        });
      }
    })
  }
})