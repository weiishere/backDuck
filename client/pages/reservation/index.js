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
    haveAddressList: false,
    currData: '',
    multiIndex: [0, 0, 0, 0, 0],
    multiArray: [],
    year: "",
    month: "",
    day: "",
    orderData: "选择预约时间"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '预约取件',
    });

    this.setDefaultTimeFn()
  },
  chooseAddressEventFn(){
    wx.navigateTo({
      url: '/pages/address/index?pageorigin=reservation',
    })
  },

  //确认预约取件
  submitClickEvent(){
    const { currData } = this.data;
    console.log(this.data)
    return false;
    if (currData && currData.id) {
      this.addBespeakFn()
    } else {
      showModel({
        title: "错误",
        content: '请选择地址~'
      });
    } 
  },
  getDefaultAddressFn() {
    const timestamp = Date.parse(new Date()),
      { currData } = this.data;

    singleRequest({
      url: config.API.address.getDefaultAddress,
      method: 'GET',
      postData: {
      },
      success: (res) => {
        this.setData({
          currData: res.data
        })
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '出错啦'
        });
      }
    })
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
  },
  /**
   * 新的时间选择控件
   */
  setDefaultTimeFn: function (options) {
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()

    var surplusMonth = this.surplusMonth(year);
    // console.log(surplusMonth)
    var surplusDay = this.surplusDay(year, month, day);
    // console.log(surplusDay)
    var surplusHour = this.surplusHour()
    var surplusMinute = this.surplusMinute()
    
    console.log('surplusHour: ', surplusHour)
    console.log('surplusMinute: ', surplusMinute)

    this.setData({
      multiArray: [[year + '年', (year + 1) + '年', (year + 2) + '年'],
      surplusMonth,
      surplusDay,
      surplusHour,
      surplusMinute
      ],
      year: year,
      month: month,
      day: day
    })
  },
  surplusMonth: function (year) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var monthDatas = [];
    if (year == year2) {
      var surplusMonth = 12 - month;
      monthDatas.push(month + "月")
      for (var i = month; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    } else {
      for (var i = 0; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    }

    return monthDatas;
  },
  surplusDay: function (year, month, day) {
    var days = 31;
    var dayDatas = [];
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1

    switch (parseInt(month)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        days = 31;

        break;
      //对于2月份需要判断是否为闰年
      case 2:
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
          days = 29;

          break;
        } else {
          days = 28;

          break;
        }

      case 4:
      case 6:
      case 9:
      case 11:
        days = 30;

        break;

    }
    if (year == year2 && month == month2) {
      dayDatas.push(day + "日")
      for (var i = day; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    } else {
      // console.log(month + "月" + days + "天")
      for (var i = 0; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    }
    return dayDatas;
  },
  surplusHour: function (year, month, day, hour) {
    var surplusHours = [];
    for (let i = 8; i <= 22; i++) {
      surplusHours.push(i+'点')
    }
    return surplusHours;
  },
  surplusMinute(){
    const minute = []
    for (let i = 0; i <= 59; i++) {
      if (i%5 == 0) {
        minute.push(i+'分')
      }
    }
    return minute;
  },
  bindMultiPickerColumnChange: function (e) {
    var date = new Date();
    var year1 = date.getFullYear()
    var month1 = date.getMonth() + 1
    var day1 = date.getDate();
    var hour1 = date.getHours();
    console.log("当前年份" + this.data.month + '修改的列为', e.detail.column, '，值为', e.detail.value);

    let surplusHour = this.surplusHour(),
      surplusMinute = this.surplusMinute();
      
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        var yearStr = data.multiArray[e.detail.column][e.detail.value];
        var year = yearStr.substring(0, yearStr.length - 1)
        data.year = parseInt(year);
        var surplusMonth = this.surplusMonth(year);
        data.multiArray[1] = surplusMonth;

        if (data.year == year1) {
          data.month = month1;
        } else {
          data.month = 1;
        }
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);

        data.multiArray[2] = surplusDay;

        data.multiArray[3] = surplusHour[0];
        data.multiArray[4] = surplusHour[1];

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[4] = 0;
        break;
      case 1:
        console.log('选择月份' + data.multiArray[e.detail.column][e.detail.value]);

        var monthStr = data.multiArray[e.detail.column][e.detail.value];
        var month = monthStr.substring(0, monthStr.length - 1);

        data.month = month;
        data.day = 1;

        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);

        data.multiArray[2] = surplusDay;
        data.multiArray[3] = surplusHour[0];
        data.multiArray[4] = surplusHour[1];

        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[4] = 0;
        break;
      case 2:
        console.log('选择日' + data.multiArray[e.detail.column][e.detail.value]);
        var dayStr = data.multiArray[e.detail.column][e.detail.value];
        var day = dayStr.substring(0, dayStr.length - 1);
        data.day = day;

        data.multiArray[3] = surplusHour
        data.multiArray[4] = surplusMinute;

        data.multiIndex[3] = 0;
        data.multiIndex[4] = 0;
        break;
      case 3:
        console.log('时间： ' + data.multiArray[e.detail.column][e.detail.value]);
        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        var hour = hourStr.substring(0, hourStr.length - 1);

        data.multiArray[4] = surplusMinute;
        data.multiIndex[4] = 0;

        break;
      case 4:
        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        console.log('hourStr: ', hourStr)
        var hour = hourStr.substring(0, hourStr.length - 1);

        console.log('分钟： ' + data.multiArray[e.detail.column][e.detail.value]);
        break;
    }
    this.setData(data)

  },
  bindMultiPickerChange: function (e) {
    const { multiArray, multiIndex} = this.data;
    const year = multiArray[0][multiIndex[0]],
          mounth = multiArray[1][multiIndex[1]],
          day = multiArray[2][multiIndex[2]],
          Hours = multiArray[3][multiIndex[3]],
          Minute = multiArray[4][multiIndex[4]];

    console.log('year: ', year.substring(0, year.length - 1))
    console.log('mounth: ', mounth.substring(0, mounth.length - 1))
    console.log('day: ', day.substring(0, day.length - 1))
    console.log('Hours: ', Hours.substring(0, Hours.length - 1))
    console.log('Minute: ', Minute.substring(0, Minute.length - 1))

    console.log(multiIndex[0], multiIndex[1], multiIndex[2], multiIndex[3], multiIndex[4])
    
    const dateStr =
      multiArray[0][multiIndex[0]] +
      multiArray[1][multiIndex[1]] +
      multiArray[2][multiIndex[2]] +
      multiArray[3][multiIndex[3]] +
      multiArray[4][multiIndex[4]];
    console.log('picker发送选择改变，携带值为', dateStr)
    this.setData({
      orderData: dateStr
    })
  }
})