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
    txtStyle: ''
  },
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '我的消息'
    })
    this.getMessageListFn()
  },
  //获取消息列表
  getMessageListFn() {
    const $this = this;
    singleRequest({
      url: config.API.message.list,
      postData: {
        pageSize: this.data.pageSize || 10,
        currentPage: this.data.currentPage || 1
      },
      method: 'get',
      success: (res) => {
        console.log('res: ', res)
        let data = res.data
        // let data = [
        //   {
        //     "id": 4,
        //     "msgTitle": "签收通知",
        //     "msgContent": "您的订单已全部签收，如有疑问，请致电客服400023654，我们将竭诚为你服务",
        //     "msgType": 104,
        //     "businessId": 123456789,
        //     "isRead": 1,
        //     "gmtCreate": 1530003715000,
        //     "gmtModified": 1530003718000,
        //     "state": 1,
        //     "userId": null
        //   },
        //   {
        //     "id": 1,
        //     "msgTitle": "取件通知",
        //     "msgContent": "黑鸭子物流人员【张三】于17：30已完成上门取件，取件码：756230",
        //     "msgType": 101,
        //     "businessId": 123456789,
        //     "isRead": 1,
        //     "gmtCreate": 1530003646000,
        //     "gmtModified": 1530003650000,
        //     "state": 1,
        //     "userId": null
        //   },
        //   {
        //     "id": 2,
        //     "msgTitle": "订单生成",
        //     "msgContent": "您的订单生成，订单号：123456789。本次消费560，取件码：756320",
        //     "msgType": 102,
        //     "businessId": 123456789,
        //     "isRead": 1,
        //     "gmtCreate": 1530003646000,
        //     "gmtModified": 1530003650000,
        //     "state": 1,
        //     "userId": null
        //   },
        //   {
        //     "id": 3,
        //     "msgTitle": "护理完成",
        //     "msgContent": "您的订单已护理完成，我们稍后为你安排配送，取件码：756802",
        //     "msgType": 103,
        //     "businessId": 123456789,
        //     "isRead": 1,
        //     "gmtCreate": 1530003607000,
        //     "gmtModified": 1530003619000,
        //     "state": 1,
        //     "userId": null
        //   }
        // ];
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
        $this.setData({
          list: data
        })
      },
      error(res) {
        // showModel({
        //   title: "错误",
        //   content: res.msg || '报错了~'
        // });
        let data = [
          {
            "id": 4,
            "msgTitle": "签收通知",
            "msgContent": "您的订单已全部签收，如有疑问，请致电客服400023654，我们将竭诚为你服务",
            "msgType": 104,
            "businessId": 123456789,
            "isRead": 1,
            "gmtCreate": 1530003715000,
            "gmtModified": 1530003718000,
            "state": 1,
            "userId": null
          },
          {
            "id": 1,
            "msgTitle": "取件通知",
            "msgContent": "黑鸭子物流人员【张三】于17：30已完成上门取件，取件码：756230",
            "msgType": 101,
            "businessId": 123456789,
            "isRead": 1,
            "gmtCreate": 1530003646000,
            "gmtModified": 1530003650000,
            "state": 1,
            "userId": null
          },
          {
            "id": 2,
            "msgTitle": "订单生成",
            "msgContent": "您的订单生成，订单号：123456789。本次消费560，取件码：756320",
            "msgType": 102,
            "businessId": 123456789,
            "isRead": 1,
            "gmtCreate": 1530003646000,
            "gmtModified": 1530003650000,
            "state": 1,
            "userId": null
          },
          {
            "id": 3,
            "msgTitle": "护理完成",
            "msgContent": "您的订单已护理完成，我们稍后为你安排配送，取件码：756802",
            "msgType": 103,
            "businessId": 123456789,
            "isRead": 1,
            "gmtCreate": 1530003607000,
            "gmtModified": 1530003619000,
            "state": 1,
            "userId": null
          }
        ];
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
        $this.setData({
          list: data
        })
      }
    })
  },
  //获取消息列表
  deleteMessageByIdFn(id) {
    const $this = this;
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
  }
})