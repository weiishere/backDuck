/**
 * 重要：
 * 左滑删除单个的时候需要设置JS里 list 的 txtStyle，
 * 并且在wxml 的 每个notice-item，
 * 设置当前item style="{{item.txtStyle，}}"
*/
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
    list: [],
    delBtnWidth: 80,
    txtStyle: '',
    txtStyle: '', 
    nocontent: false,
    pageSize: 10,
    currentPage: 1
  },
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '我的消息'
    })
    this.getMessageListFn()
  },
  //获取消息列表
  getMessageListFn(paged = false) {
    const $this = this;
    let { list, pageSize, currentPage } = this.data;
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url: config.API.message.list,
      postData: {
        pageSize: this.data.pageSize || 10,
        currentPage: this.data.currentPage || 1
      },
      method: 'get',
      success: (res) => {
        let data = res.data
        data.map((item, index) => {
          let statusText = '';
          if (item.state == -1) {
            statusText = '取消'
          } else if (item.state == 0) {
            statusText = '待取件'
          } else if (item.state == 1) {
            statusText = '已取件'
          } else if (item.state == 2) {
            statusText = '已下单'
          }
          item.statusText = statusText
          item.time = formatDateTime(item.takePartTime)
          item.txtStyle = ''
          return item
        })
        if (paged) {
          list = list.concat(data);
        } else {
          list = data
        }
        $this.setData({
          list,
          currentPage: (currentPage > 1 && data.length == 0) ? (currentPage - 1) : currentPage,
          nocontent: (currentPage == 1 && data.length == 0)
        })
      },
      error(res) {
        $this.setData({
          currentPage: currentPage > 1 ? (currentPage - 1) : currentPage,
          nocontent: (currentPage == 1)
        })
      }
    })
  },
  //获取消息列表
  deleteMessageByIdFn(id) {
    const $this = this;
    wx.showLoading({
      title: '',
    })
    singleRequest({
      url: config.API.message.deleteByMsgId,
      postData: {
        msgId: id
      },
      success: (res) => {
        showModel({
          title: "成功",
          content: res.msg || '删除成功~'
        }, () => {
          this.getMessageListFn()
        });
      },
      error(res) {
        showModel({
          title: "错误",
          content: res.msg || '报错了~'
        });
      }
    })
  },
  touchS: function (e) {

    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }

  },

  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var {list} = this.data;
      list[index].txtStyle = txtStyle;

      //更新列表的状态
      this.setData({
        list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var {list} = this.data;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list
      });
    }
  },

  //删除事件
  delNoticeFn(e){
    const { id, index } = e.currentTarget.dataset
    console.log(e.currentTarget.dataset)
    const {list} = this.data
    // list.forEach((item, index)=>{
    //   // item.
    // })
    this.deleteMessageByIdFn(id)
  },
  lowerFn() {
    const { currentPage } = this.data
    this.setData({
      currentPage: currentPage + 1
    }, () => {
      this.getMessageListFn(true)
    })
  }
})