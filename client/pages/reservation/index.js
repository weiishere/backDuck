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
    this.getDefaultAddressFn()
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
    const { currData, timestamp } = this.data;
    // console.log(this.data)
    // return false;
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
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    // if (hour >= 22) {
    //   day = day + 1
    //   hour = 8
    // }
    let surplusMonth = this.surplusMonth(year);
    let surplusDay = this.surplusDay(year, month, day);
    let surplusHour = this.surplusHour(hour)
    let surplusMinute = this.surplusMinute(minutes)

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
    let date = new Date();
    let year2 = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let monthDatas = [];
    if (year == year2) {
      let surplusMonth = 12 - month;
      monthDatas.push(month + "月")
      for (let i = month; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    } else {
      for (let i = 0; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    }

    return monthDatas;
  },
  surplusDay: function (year, month, day) {
    let days = 31;
    let dayDatas = [];
    let date = new Date();
    let year2 = date.getFullYear()
    let month2 = date.getMonth() + 1

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
      dayDatas.push(day - 0 + "日")
      for (let i = day; i < days; i++) {
        dayDatas.push(i - 0 + 1 + "日")
      }
    } else {
      // console.log(month + "月" + days + "天")
      for (let i = 0; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    }
    // console.log(dayDatas)
    return dayDatas;
  },
  surplusHour (hour = 0) {
    let surplusHours = [];
    for (let i = hour; i <= 23; i++) {
      surplusHours.push(i+'点')
    }
    return surplusHours;
  },
  surplusMinute(minute = 0){
    const minuteArr = []
    console.log(minute)
    if (minute) {
      minute = minute + 30
    } else {
      minute = minute
    }
    for (let i = minute; i <= 59; i++) {
      if (i%5 == 0) {
        minuteArr.push(i+'分')
      }
    }
    return minuteArr;
  },
  bindMultiPickerColumnChange: function (e) {
    let date = new Date();
    let year1 = date.getFullYear()
    let month1 = date.getMonth() + 1
    let day1 = date.getDate();
    let hour1 = date.getHours();
    let minutes = date.getMinutes();
    // console.log("当前年份" + this.data.month + '修改的列为', e.detail.column, '，值为', e.detail.value);
      
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day
    };
    data.multiIndex[e.detail.column] = e.detail.value;


    switch (e.detail.column) {
      case 0:
        let yearStr = data.multiArray[e.detail.column][e.detail.value];
        let year = yearStr.substring(0, yearStr.length - 1)
        data.year = parseInt(year);
        let surplusMonth = this.surplusMonth(year);
        data.multiArray[1] = surplusMonth;

        if (data.year == year1) {
          data.month = month1;

          // if (data.hour >= 22) {
          //   data.day = day1 + 1
          // }
          data.multiArray[3] = this.surplusHour(hour1)
          data.multiArray[4] = this.surplusMinute(minutes);
        } else {
          data.month = 1;
          data.multiArray[3] = this.surplusHour()
          data.multiArray[4] = this.surplusMinute();
        }
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        data.multiArray[2] = this.surplusDay(data.year, data.month, data.day);

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[4] = 0;
        break;
      case 1:
        // console.log('选择月份' + data.multiArray[e.detail.column][e.detail.value]);
        let monthStr = data.multiArray[e.detail.column][e.detail.value];
        let month = monthStr.substring(0, monthStr.length - 1);
        // console.log('monthStr: ', monthStr, 'month: ', month)
        data.month = month;
        data.day = 1;

        console.log('data: ', data)

        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
          data.multiArray[3] = this.surplusHour(hour1)
          data.multiArray[4] = this.surplusMinute(minutes);
        } else {
          data.day = 1;
          data.multiArray[3] = this.surplusHour()
          data.multiArray[4] = this.surplusMinute();
        }

        data.multiArray[2] = this.surplusDay(data.year, data.month, data.day);
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[4] = 0;
        break;
      case 2:
        console.log('选择日' + data.multiArray[e.detail.column][e.detail.value]);
        let dayStr = data.multiArray[e.detail.column][e.detail.value];
        let day = dayStr.substring(0, dayStr.length - 1);

        if (day == day1) {
          data.multiArray[3] = this.surplusHour(hour1)
          data.multiArray[4] = this.surplusMinute(minutes);
        } else {
          data.multiArray[3] = this.surplusHour()
          data.multiArray[4] = this.surplusMinute();
        }
        data.day = day;
        data.multiIndex[3] = 0;
        data.multiIndex[4] = 0;

        break;
      case 3:
        let hourStr = data.multiArray[e.detail.column][e.detail.value];
        let hour = hourStr.substring(0, hourStr.length - 1);
        // console.log('时间： ' + data.multiArray[e.detail.column][e.detail.value]);
        if (hour1 != hour) {
          minutes = 0
        }
        data.multiArray[4] = this.surplusMinute(minutes);
        data.multiIndex[4] = 0;
        break;
      case 4:
        // console.log('分钟： ' + data.multiArray[e.detail.column][e.detail.value]);
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
          Minute = multiArray[4][multiIndex[4]],
          yyyy = year.substring(0, year.length - 1),
          MM = mounth.substring(0, mounth.length - 1),
          dd = day.substring(0, day.length - 1),
          HH = Hours.substring(0, Hours.length - 1),
          mm = Minute.substring(0, Minute.length - 1),
      dateTime = `${yyyy}/${(MM - 0) <= 9 ? ('0' + MM) : MM}/${(dd - 0) <= 9 ? ('0' + dd) : dd} ${(HH - 0) <= 9 ? ('0' + HH) : HH}:${(mm - 0) <= 9 ? ('0' + mm) : mm}:00`;

    // console.log(dateTime)
    const time = new Date(dateTime),
          timestamp = time.getTime();
    const dateStr = `${yyyy}年${(MM - 0) <= 9 ? ('0' + MM) : MM}月${(dd - 0) <= 9 ? ('0' + dd) : dd}日 ${(HH - 0) <= 9 ? ('0' + HH) : HH}:${(mm - 0) <= 9 ? ('0' + mm) : mm}:00`;
    // console.log('picker发送选择改变，携带值为', dateStr)
    this.setData({
      orderData: dateStr,
      dateTime,
      timestamp
    })
  }
})