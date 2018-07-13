/**
 * 重要：
 * 左滑删除单个的时候需要设置JS里 list 的 txtStyle，
 * 并且在wxml 的 每个notice-item，
 * 设置当前item style="{{item.txtStyle，}}"
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 80,
    txtStyle: ''
  },
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '我的消息'
    })
  },
  getNotice(){
    
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
      var index = e.target.dataset.index;
      // var list = this.data.list;
      // list[index].txtStyle = txtStyle;
      txtStyle = txtStyle

      //更新列表的状态
      this.setData({
        txtStyle: txtStyle
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
      var index = e.target.dataset.index;
      // var list = this.data.list;
      // list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        txtStyle
      });
    }
  },

  //删除事件
  delNoticeFn(e){
    console.log(e.currentTarget.dataset.id)
  }
})