Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
}
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
}
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '');
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDateTime = (inputTime) =>  {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content, fn) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content || '暂无异常描述'),
    showCancel: false,
    success: (res) => {
      fn && fn(res)
    }
  })
}

//**通用方法：获取链表数据 */
var getObject = function(list, key, value, handler) {
  let result;
  list.forEach((item, i) => {
    if (item[key] === value) {
      result = item;
    }
    handler && handler(item, i);
  });
  return result;
}
var getItemDataByServer = function({
  url,
  keyData
}) {
  wx.showLoading('加载中...');
  return Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: keyData,
      success: function(res) {
        if (res.data.code == '00001') {
          resolve(res.data);
        } else {
          util.showModel('操作失败(' + res.data.code + ')');
          reject();
        }
      },
      fail: function() {
        showModel('请求错误');
        reject();
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  });

}
var singleRequest = function({
  url,
  postData,
  success,
  error,
  fail,
  complete,
  method,
  alert
}) {
  const app = getApp();
  if (!postData) postData = {};
  wx.request({
    url: url,
    data: postData,
    method: method || 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': app.userInfo.cookie,
      'token': app.userInfo.token
    },
    success: function(res) {
      if (res.data.status == '200') {
        if (alert) showSuccess('操作成功');
        success && success(res.data);
      } else {
        if (res.data.data) {
          success && success(res.data);
        }
        if (res.data.status === 201) {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/bindphone/index'
            });
          }, 500);
        } else {
          showModel('操作失败(' + res.data.status + ')');
          error && error(res.data);
        }
      }
    },
    fail: function() {
      showModel('请求错误');
      fail && fail();
    },
    complete: function(res) {
      wx.hideLoading();
      complete && complete(res);
    }
  });
}
var clone = function(obj) {
  var copy;
  if (null == obj || "object" != typeof obj) return obj;
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

module.exports = {
  formatTime,
  formatDateTime,
  showBusy,
  showSuccess,
  showModel,
  getObject,
  getItemDataByServer,
  singleRequest,
  clone
}