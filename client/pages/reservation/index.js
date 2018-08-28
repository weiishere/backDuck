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
    multiIndex: [0, 0, 0, 0, 0, 0],
    multiArray: [],
    year: "",
    month: "",
    day: "",
    startHour: "",
    endHour: "",
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
    console.log(surplusMonth)
    var surplusDay = this.surplusDay(year, month, day);
    console.log(surplusDay)
    var surplusHour = this.surplusHour(year, month, day, hour)
    console.log(surplusHour)

    this.setData({
      multiArray: [[year + '年', (year + 1) + '年', (year + 2) + '年'],
        surplusMonth,
        surplusDay,
      surplusHour[0],
      ['~'],
      surplusHour[1]
      ],
      year: year,
      month: month,
      day: day,
      startHour: surplusHour[0][0],
      endHour: surplusHour[1][0],
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
      console.log(month + "月" + days + "天")
      for (var i = 0; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    }
    return dayDatas;
  },
  surplusHour: function (year, month, day, hour) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1
    var day2 = date.getDate();
    var hourEnd = [4, 8, 12, 16, 20, 24];
    var hours = [['00时', '04时', '08时', '12时', '16时', '20时'], ['04时', '08时', '12时', '16时', '20时', '24时']];

    if (year == year2 && month == month2 && day == day2) {
      var hour2 = hour
      var j = 0;
      for (var i = 0; i < hourEnd.length; i++) {
        console.log("离24点还" + (hourEnd[i] - hour))
        if ((hourEnd[i] - hour) > 0) {
          console.log("i" + i)
          j = i;
          break;
        }
      }
      var surplusHours = [[], []];
      for (var i = j; i < hours[0].length; i++) {
        // console.log(hours[0][i])
        surplusHours[0].push(hours[0][i]);
      }
      for (var i = j; i < hours[1].length; i++) {
        // console.log(hours[1][i])
        surplusHours[1].push(hours[1][i]);
      }

      hours = surplusHours;
    }
    return hours;
  },
  bindMultiPickerColumnChange: function (e) {
    var date = new Date();
    var year1 = date.getFullYear()
    var month1 = date.getMonth() + 1
    var day1 = date.getDate()
    var hour1 = date.getHours()
    console.log("当前年份" + this.data.month + '修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      startHour: this.data.startHour,
      endHour: this.data.startHour,
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
        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }

        console.log(surplusHour)

        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];


        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
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

        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }


        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];


        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 2:
        console.log('选择日' + data.multiArray[e.detail.column][e.detail.value]);
        var dayStr = data.multiArray[e.detail.column][e.detail.value];
        var day = dayStr.substring(0, dayStr.length - 1);
        data.day = day;

        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }


        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];



        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];

        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 3:
        console.log('起始时间' + data.multiArray[e.detail.column][e.detail.value]);

        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        var hour = hourStr.substring(0, hourStr.length - 1);
        data.startHour = hour;
        console.log('起始时间' + hour);
        var endhours2 = [];
        if (data.year == year1 && data.month == month1 && data.day == day1) {
          var surplusHour = this.surplusHour(data.year, data.month, data.day, hour);
          endhours2 = surplusHour[1]
        } else {
          var end = ['04时', '08时', '12时', '16时', '20时', '24时'];
          for (var i = e.detail.value; i < end.length; i++) {
            endhours2.push(end[i]);
          }
        }


        data.multiArray[5] = endhours2;
        data.multiIndex[5] = 0;

        break;
      case 5:
        var hourStr = data.multiArray[e.detail.column][e.detail.value];
        var hour = hourStr.substring(0, hourStr.length - 1);
        data.endHour = hour;
        console.log('结束时间' + data.multiArray[e.detail.column][e.detail.value]);
        break;
    }
    this.setData(data)

  },
  bindMultiPickerChange: function (e) {
    const year = this.data.multiArray[0][this.data.multiIndex[0]],
          mounth = this.data.multiArray[1][this.data.multiIndex[1]],
          day = this.data.multiArray[2][this.data.multiIndex[2]],
          startHours = this.data.multiArray[3][this.data.multiIndex[3]],
          flag = this.data.multiArray[4][this.data.multiIndex[4]],
          endHours = this.data.multiArray[5][this.data.multiIndex[5]];

    console.log('year: ', year)
    console.log('mounth: ', mounth)
    console.log('day: ', day)
    console.log('startHours: ', startHours)
    console.log('flag: ', flag)
    console.log('endHours: ', endHours)

    var dateStr =
      this.data.multiArray[0][this.data.multiIndex[0]] +
      this.data.multiArray[1][this.data.multiIndex[1]] +
      this.data.multiArray[2][this.data.multiIndex[2]] +
      this.data.multiArray[3][this.data.multiIndex[3]] +
      this.data.multiArray[4][this.data.multiIndex[4]] +
      this.data.multiArray[5][this.data.multiIndex[5]];
    console.log('picker发送选择改变，携带值为', dateStr)
    this.setData({
      orderData: dateStr
    })
  }
})